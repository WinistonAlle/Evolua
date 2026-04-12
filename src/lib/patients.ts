export type Patient = {
  id: string;
  name: string;
  createdAt: string;
  phone?: string;
  email?: string;
  insurance?: string;
  status?: string;
};

export type PatientExamLink = {
  id: string;
  label: string;
  url: string;
  category: "laboratory" | "radiography" | "other";
};

export type PatientProfile = {
  examLinks: PatientExamLink[];
  recordUrl: string;
  ageLabel: string;
  phone: string;
  email: string;
  insurance: string;
  mainComplaint: string;
  alerts: string;
  observations: string;
  nextSteps: string;
  savedAt?: string | null;
};

const PATIENTS_STORAGE_KEY = "evolua_patients";
const DEFAULT_CREATED_AT = "2026-01-01T00:00:00.000Z";

const defaultPatients: Patient[] = [
  { id: "1", name: "João Silva", createdAt: DEFAULT_CREATED_AT },
  { id: "2", name: "Maria Oliveira", createdAt: DEFAULT_CREATED_AT },
  { id: "3", name: "Carlos Souza", createdAt: DEFAULT_CREATED_AT },
];

function isBrowser() {
  return typeof window !== "undefined";
}

function createLocalId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `local-${Math.random().toString(36).slice(2, 10)}`;
}

export function createPatientExamLink(
  label = "",
  url = "",
  category: PatientExamLink["category"] = "other",
): PatientExamLink {
  return {
    id: createLocalId(),
    label,
    url,
    category,
  };
}

export function normalizePatientExamLinks(
  links: Array<Partial<PatientExamLink>> | undefined,
  legacyExamUrl = "",
) {
  const normalized = Array.isArray(links)
    ? links
        .map((link) => ({
          id: typeof link.id === "string" && link.id ? link.id : createLocalId(),
          label: typeof link.label === "string" ? link.label : "",
          url: typeof link.url === "string" ? link.url : "",
          category:
            link.category === "laboratory" ||
            link.category === "radiography" ||
            link.category === "other"
              ? link.category
              : "other",
        }))
        .filter((link) => link.label.trim() || link.url.trim())
    : [];

  if (normalized.length > 0) {
    return normalized;
  }

  if (legacyExamUrl.trim()) {
    return [createPatientExamLink("Exames", legacyExamUrl)];
  }

  return [];
}

function createEmptyPatientProfile(): PatientProfile {
  return {
    examLinks: [],
    recordUrl: "",
    ageLabel: "",
    phone: "",
    email: "",
    insurance: "",
    mainComplaint: "",
    alerts: "",
    observations: "",
    nextSteps: "",
    savedAt: null,
  };
}

export function sanitizePatientName(raw: string) {
  return raw.trim().replace(/\s+/g, " ");
}

export function readPatients(): Patient[] {
  if (!isBrowser()) return defaultPatients;

  const raw = window.localStorage.getItem(PATIENTS_STORAGE_KEY);
  if (!raw) return defaultPatients;

  try {
    const parsed = JSON.parse(raw) as Patient[];

    if (!Array.isArray(parsed)) {
      return defaultPatients;
    }

    const normalized = parsed
      .filter((patient): patient is Patient => Boolean(patient?.id && patient?.name))
      .map((patient) => ({
        id: String(patient.id),
        name: sanitizePatientName(String(patient.name)),
        createdAt: patient.createdAt || DEFAULT_CREATED_AT,
      }));

    return normalized.length > 0 ? normalized : defaultPatients;
  } catch {
    return defaultPatients;
  }
}

export function readStoredPatients(): Patient[] {
  if (!isBrowser()) return [];

  const raw = window.localStorage.getItem(PATIENTS_STORAGE_KEY);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw) as Patient[];

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .filter((patient): patient is Patient => Boolean(patient?.id && patient?.name))
      .map((patient) => ({
        id: String(patient.id),
        name: sanitizePatientName(String(patient.name)),
        createdAt: patient.createdAt || DEFAULT_CREATED_AT,
        phone: patient.phone || "",
        email: patient.email || "",
        insurance: patient.insurance || "",
        status: patient.status || "active",
      }));
  } catch {
    return [];
  }
}

export function writePatients(patients: Patient[]) {
  if (!isBrowser()) return;
  window.localStorage.setItem(PATIENTS_STORAGE_KEY, JSON.stringify(patients));
}

export function createPatient(name: string): Patient {
  return {
    id: crypto.randomUUID(),
    name: sanitizePatientName(name),
    createdAt: new Date().toISOString(),
    status: "active",
  };
}

export function getPatientLinksStorageKey(patientId: string) {
  return `evolua_patient_links_${patientId}`;
}

export function readPatientLinks(patientId: string): PatientProfile {
  if (!isBrowser()) return createEmptyPatientProfile();

  const raw = window.localStorage.getItem(getPatientLinksStorageKey(patientId));
  if (!raw) return createEmptyPatientProfile();

  try {
    const parsed = JSON.parse(raw) as Partial<PatientProfile> & { examsUrl?: string };
    return {
      examLinks: normalizePatientExamLinks(parsed.examLinks, parsed.examsUrl || ""),
      recordUrl: parsed.recordUrl || "",
      ageLabel: parsed.ageLabel || "",
      phone: parsed.phone || "",
      email: parsed.email || "",
      insurance: parsed.insurance || "",
      mainComplaint: parsed.mainComplaint || "",
      alerts: parsed.alerts || "",
      observations: parsed.observations || "",
      nextSteps: parsed.nextSteps || "",
      savedAt: parsed.savedAt || null,
    };
  } catch {
    return createEmptyPatientProfile();
  }
}

export function writePatientLinks(patientId: string, data: PatientProfile) {
  if (!isBrowser()) return;
  window.localStorage.setItem(getPatientLinksStorageKey(patientId), JSON.stringify(data));
}

export function readStoredPatientProfile(patientId: string): PatientProfile | null {
  if (!isBrowser()) return null;

  const raw = window.localStorage.getItem(getPatientLinksStorageKey(patientId));
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as Partial<PatientProfile> & { examsUrl?: string };
    return {
      ...createEmptyPatientProfile(),
      examLinks: normalizePatientExamLinks(parsed.examLinks, parsed.examsUrl || ""),
      recordUrl: parsed.recordUrl || "",
      ageLabel: parsed.ageLabel || "",
      phone: parsed.phone || "",
      email: parsed.email || "",
      insurance: parsed.insurance || "",
      mainComplaint: parsed.mainComplaint || "",
      alerts: parsed.alerts || "",
      observations: parsed.observations || "",
      nextSteps: parsed.nextSteps || "",
      savedAt: parsed.savedAt || null,
    };
  } catch {
    return null;
  }
}

export function clearLegacyPatientsStorage() {
  if (!isBrowser()) return;

  const patients = readStoredPatients();
  window.localStorage.removeItem(PATIENTS_STORAGE_KEY);

  for (const patient of patients) {
    window.localStorage.removeItem(getPatientLinksStorageKey(patient.id));
  }
}
