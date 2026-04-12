import { createContext } from "react";
import type { Session } from "@supabase/supabase-js";

export type AuthContextValue = {
  loading: boolean;
  session: Session | null;
};

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);
