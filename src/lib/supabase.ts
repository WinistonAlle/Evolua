import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL as string;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;
const authRedirectUrl = import.meta.env.VITE_AUTH_REDIRECT_URL as string | undefined;
const FALLBACK_SUPABASE_URL = "https://placeholder.supabase.co";
const FALLBACK_SUPABASE_ANON_KEY = "placeholder-anon-key";

function isPlaceholder(value: string | undefined) {
  if (!value) return true;
  return (
    value.includes("SEU-PROJETO") ||
    value.includes("SUA_ANON_KEY_AQUI") ||
    value.includes("example.supabase.co")
  );
}

export function isSupabaseConfigured() {
  return Boolean(url && anonKey && !isPlaceholder(url) && !isPlaceholder(anonKey));
}

export function getSupabaseConfigError() {
  if (isSupabaseConfigured()) return null;
  return "Configuração do Supabase ausente. Preencha VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no arquivo .env.";
}

export function getAuthRedirectUrl() {
  if (authRedirectUrl && !isPlaceholder(authRedirectUrl)) {
    return authRedirectUrl;
  }

  if (typeof window !== "undefined") {
    return `${window.location.origin}/login`;
  }

  return undefined;
}

export function ensureSupabaseConfigured() {
  if (!isSupabaseConfigured()) {
    throw new Error(getSupabaseConfigError() ?? "Supabase não configurado.");
  }
}

export const supabase = createClient(
  isSupabaseConfigured() ? url : FALLBACK_SUPABASE_URL,
  isSupabaseConfigured() ? anonKey : FALLBACK_SUPABASE_ANON_KEY,
  {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
