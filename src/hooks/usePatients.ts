import { useContext } from "react";
import { PatientsContext } from "../contexts/patients-context";

export function usePatients() {
  const context = useContext(PatientsContext);

  if (!context) {
    throw new Error("usePatients must be used within PatientsProvider");
  }

  return context;
}
