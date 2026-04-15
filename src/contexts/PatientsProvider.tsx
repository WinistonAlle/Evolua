import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { useAuth } from "./useAuth";
import { PatientsContext } from "./patients-context";
import type { Patient, PatientProfile } from "../lib/patients";
import {
  createPatientRecord,
  dischargePatientRecord,
  getPatientRecord,
  listPatients,
  savePatientRecord,
  type PatientWorkspace,
} from "../lib/patients-service";

export function PatientsProvider({ children }: { children: ReactNode }) {
  const { session } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [workspace, setWorkspace] = useState<PatientWorkspace | null>(null);

  const refreshPatients = useCallback(async () => {
    if (!session?.user.id) {
      setPatients([]);
      setWorkspace(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const result = await listPatients(session.user.id);
      setPatients(result.patients);
      setWorkspace(result.workspace);
    } catch (nextError) {
      const message = nextError instanceof Error ? nextError.message : "Erro ao carregar pacientes.";
      setPatients([]);
      setWorkspace(null);
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [session?.user.id]);

  useEffect(() => {
    void refreshPatients();
  }, [refreshPatients]);

  const addPatient = useCallback(async (name: string, profile?: PatientProfile) => {
    if (!session?.user.id) {
      throw new Error("Sessão não encontrada.");
    }

    const created = await createPatientRecord(session.user.id, name, profile);
    setPatients((current) => [created, ...current]);
    return created;
  }, [session?.user.id]);

  const dischargePatient = useCallback(async (patientId: string) => {
    if (!session?.user.id) {
      throw new Error("Sessão não encontrada.");
    }

    try {
      setSaving(true);
      setError(null);
      await dischargePatientRecord(session.user.id, patientId);
      setPatients((current) =>
        current.map((patient) =>
          patient.id === patientId ? { ...patient, status: "discharged" } : patient,
        ),
      );
    } catch (nextError) {
      const message =
        nextError instanceof Error ? nextError.message : "Erro ao dar alta ao paciente.";
      setError(message);
      throw nextError;
    } finally {
      setSaving(false);
    }
  }, [session?.user.id]);

  const getPatientById = useCallback((id?: string | null) => {
    if (!id) return null;
    return patients.find((patient) => patient.id === id) ?? null;
  }, [patients]);

  const getPatientProfile = useCallback(async (patientId: string): Promise<PatientProfile> => {
    if (!session?.user.id) {
      throw new Error("Sessão não encontrada.");
    }

    const { patient, profile } = await getPatientRecord(session.user.id, patientId);

    setPatients((current) => {
      const next = current.filter((item) => item.id !== patient.id);
      return [patient, ...next];
    });

    return profile;
  }, [session?.user.id]);

  const savePatientProfile = useCallback(async (patientId: string, profile: PatientProfile) => {
    if (!session?.user.id) {
      throw new Error("Sessão não encontrada.");
    }

    try {
      setSaving(true);
      setError(null);
      await savePatientRecord(session.user.id, patientId, profile);

      setPatients((current) =>
        current.map((patient) =>
          patient.id === patientId
            ? {
                ...patient,
                phone: profile.phone,
                email: profile.email,
                insurance: profile.insurance,
              }
            : patient,
        ),
      );
    } catch (nextError) {
      const message = nextError instanceof Error ? nextError.message : "Erro ao salvar paciente.";
      setError(message);
      throw nextError;
    } finally {
      setSaving(false);
    }
  }, [session?.user.id]);

  const value = useMemo(
    () => ({
      loading,
      saving,
      error,
      workspace,
      patients,
      refreshPatients,
      addPatient,
      dischargePatient,
      getPatientById,
      getPatientProfile,
      savePatientProfile,
    }),
    [loading, saving, error, workspace, patients, refreshPatients, addPatient, dischargePatient, getPatientById, getPatientProfile, savePatientProfile],
  );

  return <PatientsContext.Provider value={value}>{children}</PatientsContext.Provider>;
}
