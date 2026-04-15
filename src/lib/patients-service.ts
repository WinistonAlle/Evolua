import { ensureSupabaseConfigured, supabase } from "./supabase";
import {
  clearLegacyPatientsStorage,
  createPatientExamLink,
  readStoredPatientProfile,
  readStoredPatients,
  type PatientExamLink,
  type Patient,
  type PatientProfile,
} from "./patients";

type OrganizationMembershipRow = {
  organization_id: string;
  role: string;
  is_default: boolean;
};

type PatientRow = {
  id: string;
  full_name: string;
  created_at: string;
  updated_at: string;
  phone: string | null;
  email: string | null;
  status: string | null;
  notes: string | null;
  metadata: Record<string, unknown> | null;
};

type PatientLinkRow = {
  id?: string;
  label: string;
  url: string;
  link_type: string;
  sort_order?: number | null;
};

export type PatientWorkspace = {
  organizationId: string;
  role: string;
};

function readStringMetadata(
  metadata: Record<string, unknown> | null | undefined,
  key: string,
) {
  const value = metadata?.[key];
  return typeof value === "string" ? value : "";
}

function mapPatientRow(row: PatientRow): Patient {
  return {
    id: row.id,
    name: row.full_name,
    createdAt: row.created_at,
    phone: row.phone || "",
    email: row.email || "",
    insurance: readStringMetadata(row.metadata, "insurance"),
    status: row.status || "active",
  };
}

function mapPatientProfile(row: PatientRow, links: PatientLinkRow[]): PatientProfile {
  const recordLink = links.find(
    (item) => item.link_type === "record" || item.label === "Prontuario" || item.label === "Prontuário",
  );
  const examLinks = links
    .filter((item) => item.link_type === "exams" || item.link_type.startsWith("exam"))
    .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
    .map((item) =>
      createPatientExamLink(
        item.label || "Exames",
        item.url || "",
        item.link_type === "exam_laboratory"
          ? "laboratory"
          : item.link_type === "exam_radiography"
            ? "radiography"
            : "other",
      ),
    );

  return {
    examLinks,
    recordUrl: recordLink?.url || "",
    ageLabel: readStringMetadata(row.metadata, "ageLabel"),
    phone: row.phone || "",
    email: row.email || "",
    insurance: readStringMetadata(row.metadata, "insurance"),
    mainComplaint: readStringMetadata(row.metadata, "mainComplaint"),
    alerts: readStringMetadata(row.metadata, "alerts"),
    observations: row.notes || "",
    nextSteps: readStringMetadata(row.metadata, "nextSteps"),
    savedAt: row.updated_at || row.created_at,
  };
}

function buildPatientMetadata(profile?: PatientProfile) {
  return {
    ageLabel: profile?.ageLabel || "",
    insurance: profile?.insurance || "",
    mainComplaint: profile?.mainComplaint || "",
    alerts: profile?.alerts || "",
    nextSteps: profile?.nextSteps || "",
  };
}

function normalizeExamLinksForSave(examLinks: PatientExamLink[]) {
  return examLinks
    .map((link) => ({
      label: link.label.trim(),
      url: link.url.trim(),
      category: link.category,
    }))
    .filter((link) => link.label || link.url);
}

function buildPatientLinksPayload(
  organizationId: string,
  patientId: string,
  userId: string,
  profile?: PatientProfile,
) {
  const examLinks = normalizeExamLinksForSave(profile?.examLinks || []);

  const payload = examLinks.map((link, index) => ({
    organization_id: organizationId,
    patient_id: patientId,
    label: link.label || `Exame ${index + 1}`,
    url: link.url || "",
    link_type:
      link.category === "laboratory"
        ? "exam_laboratory"
        : link.category === "radiography"
          ? "exam_radiography"
          : `exam_other_${index + 1}`,
    created_by: userId,
    sort_order: index,
  }));

  payload.push({
    organization_id: organizationId,
    patient_id: patientId,
    label: "Prontuário",
    url: profile?.recordUrl || "",
    link_type: "record",
    created_by: userId,
    sort_order: examLinks.length,
  });

  return payload.filter((item) => item.url.trim());
}

async function syncPatientLinks(
  organizationId: string,
  patientId: string,
  userId: string,
  profile?: PatientProfile,
) {
  const linksPayload = buildPatientLinksPayload(organizationId, patientId, userId, profile);

  const { data: existingLinks, error: existingLinksError } = await supabase
    .from("patient_links")
    .select("label")
    .eq("organization_id", organizationId)
    .eq("patient_id", patientId)
    .returns<Array<{ label: string }>>();

  if (existingLinksError) {
    throw new Error(existingLinksError.message);
  }

  const desiredLabels = new Set(linksPayload.map((item) => item.label));
  const labelsToDelete = (existingLinks || [])
    .map((item) => item.label)
    .filter((label) => !desiredLabels.has(label));

  if (labelsToDelete.length > 0) {
    const { error: deleteLinksError } = await supabase
      .from("patient_links")
      .delete()
      .eq("organization_id", organizationId)
      .eq("patient_id", patientId)
      .in("label", labelsToDelete);

    if (deleteLinksError) {
      throw new Error(deleteLinksError.message);
    }
  }

  if (linksPayload.length === 0) {
    return;
  }

  const { error: linksError } = await supabase.from("patient_links").upsert(linksPayload, {
    onConflict: "patient_id,label",
  });

  if (linksError) {
    throw new Error(linksError.message);
  }
}

async function getOrganizationMembership(userId: string): Promise<PatientWorkspace> {
  ensureSupabaseConfigured();

  const { data, error } = await supabase
    .from("organization_members")
    .select("organization_id, role, is_default")
    .eq("user_id", userId)
    .is("deleted_at", null)
    .order("is_default", { ascending: false })
    .limit(1)
    .maybeSingle<OrganizationMembershipRow>();

  if (error) {
    throw new Error(error.message);
  }

  if (!data?.organization_id) {
    throw new Error("Nenhuma organização ativa foi encontrada para este usuário.");
  }

  return {
    organizationId: data.organization_id,
    role: data.role,
  };
}

export async function listPatients(userId: string) {
  const workspace = await getOrganizationMembership(userId);
  await migrateLegacyPatientsIfNeeded(userId, workspace.organizationId);

  const { data, error } = await supabase
    .from("patients")
    .select("id, full_name, created_at, updated_at, phone, email, status, notes, metadata")
    .eq("organization_id", workspace.organizationId)
    .is("deleted_at", null)
    .order("created_at", { ascending: false })
    .returns<PatientRow[]>();

  if (error) {
    throw new Error(error.message);
  }

  return {
    workspace,
    patients: (data || []).map(mapPatientRow),
  };
}

export async function createPatientRecord(userId: string, name: string, profile?: PatientProfile) {
  const workspace = await getOrganizationMembership(userId);

  const { data, error } = await supabase
    .from("patients")
    .insert({
      organization_id: workspace.organizationId,
      full_name: name,
      created_by: userId,
      phone: profile?.phone || null,
      email: profile?.email || null,
      notes: profile?.observations || null,
      status: "active",
      metadata: buildPatientMetadata(profile),
    })
    .select("id, full_name, created_at, updated_at, phone, email, status, notes, metadata")
    .single<PatientRow>();

  if (error) {
    throw new Error(error.message);
  }

  await syncPatientLinks(workspace.organizationId, data.id, userId, profile);

  return {
    ...mapPatientRow(data),
    phone: profile?.phone || data.phone || "",
    email: profile?.email || data.email || "",
    insurance: profile?.insurance || readStringMetadata(data.metadata, "insurance"),
    status: "active",
  };
}

export async function getPatientRecord(userId: string, patientId: string) {
  const workspace = await getOrganizationMembership(userId);

  const [{ data: patientRow, error: patientError }, { data: linksData, error: linksError }] =
    await Promise.all([
      supabase
        .from("patients")
        .select("id, full_name, created_at, updated_at, phone, email, status, notes, metadata")
        .eq("organization_id", workspace.organizationId)
        .eq("id", patientId)
        .is("deleted_at", null)
        .single<PatientRow>(),
      supabase
        .from("patient_links")
        .select("id, label, url, link_type, sort_order")
        .eq("organization_id", workspace.organizationId)
        .eq("patient_id", patientId)
        .returns<PatientLinkRow[]>(),
    ]);

  if (patientError) {
    throw new Error(patientError.message);
  }

  if (linksError) {
    throw new Error(linksError.message);
  }

  return {
    patient: mapPatientRow(patientRow),
    profile: mapPatientProfile(patientRow, linksData || []),
  };
}

export async function savePatientRecord(
  userId: string,
  patientId: string,
  profile: PatientProfile,
) {
  const workspace = await getOrganizationMembership(userId);

  const { error: updateError } = await supabase
    .from("patients")
    .update({
      phone: profile.phone || null,
      email: profile.email || null,
      notes: profile.observations || null,
      metadata: buildPatientMetadata(profile),
    })
    .eq("organization_id", workspace.organizationId)
    .eq("id", patientId);

  if (updateError) {
    throw new Error(updateError.message);
  }

  await syncPatientLinks(workspace.organizationId, patientId, userId, profile);
}

export async function dischargePatientRecord(userId: string, patientId: string) {
  const workspace = await getOrganizationMembership(userId);

  const { data, error } = await supabase
    .from("patients")
    .update({
      status: "discharged",
    })
    .eq("organization_id", workspace.organizationId)
    .eq("id", patientId)
    .is("deleted_at", null)
    .select("id")
    .maybeSingle<{ id: string }>();

  if (error) {
    throw new Error(error.message);
  }

  if (!data?.id) {
    throw new Error("Não foi possível localizar o paciente para registrar a alta.");
  }
}

async function migrateLegacyPatientsIfNeeded(userId: string, organizationId: string) {
  const legacyPatients = readStoredPatients();
  if (legacyPatients.length === 0) return;

  const { count, error: countError } = await supabase
    .from("patients")
    .select("id", { count: "exact", head: true })
    .eq("organization_id", organizationId)
    .is("deleted_at", null);

  if (countError) {
    throw new Error(countError.message);
  }

  if ((count || 0) > 0) return;

  const patientsToMigrate = legacyPatients.filter(
    (patient) =>
      !(
        patient.createdAt === "2026-01-01T00:00:00.000Z" &&
        ["João Silva", "Maria Oliveira", "Carlos Souza"].includes(patient.name)
      ),
  );

  if (patientsToMigrate.length === 0) {
    clearLegacyPatientsStorage();
    return;
  }

  for (const legacyPatient of patientsToMigrate) {
    const legacyProfile = readStoredPatientProfile(legacyPatient.id);
    const { data, error } = await supabase
      .from("patients")
      .insert({
        organization_id: organizationId,
        full_name: legacyPatient.name,
        phone: legacyProfile?.phone || legacyPatient.phone || null,
        email: legacyProfile?.email || legacyPatient.email || null,
        notes: legacyProfile?.observations || null,
        created_by: userId,
        metadata: {
          ageLabel: legacyProfile?.ageLabel || "",
          insurance: legacyProfile?.insurance || legacyPatient.insurance || "",
          mainComplaint: legacyProfile?.mainComplaint || "",
          alerts: legacyProfile?.alerts || "",
          nextSteps: legacyProfile?.nextSteps || "",
        },
      })
      .select("id")
      .single<{ id: string }>();

    if (error) {
      throw new Error(error.message);
    }

    if (legacyProfile) {
      const legacyLinksPayload = buildPatientLinksPayload(
        organizationId,
        data.id,
        userId,
        legacyProfile,
      );

      if (legacyLinksPayload.length > 0) {
        await supabase.from("patient_links").upsert(legacyLinksPayload, {
          onConflict: "patient_id,label",
        });
      }
    }
  }

  clearLegacyPatientsStorage();
}
