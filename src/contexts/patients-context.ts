import { createContext } from "react";
import type { Patient, PatientProfile } from "../lib/patients";
import type { PatientWorkspace } from "../lib/patients-service";

export type PatientsContextValue = {
  loading: boolean;
  saving: boolean;
  error: string | null;
  workspace: PatientWorkspace | null;
  patients: Patient[];
  refreshPatients: () => Promise<void>;
  addPatient: (name: string, profile?: PatientProfile) => Promise<Patient>;
  dischargePatient: (patientId: string) => Promise<void>;
  getPatientById: (id?: string | null) => Patient | null;
  getPatientProfile: (patientId: string) => Promise<PatientProfile>;
  savePatientProfile: (patientId: string, profile: PatientProfile) => Promise<void>;
};

export const PatientsContext = createContext<PatientsContextValue | undefined>(undefined);
