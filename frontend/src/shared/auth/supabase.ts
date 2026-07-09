import { createClient, type Session } from "@supabase/supabase-js";

import { sessionStorageApi } from "../api/session";
import { env } from "../config/env";

const supabaseUrl = env.supabaseUrl || "http://localhost:54321";
const supabaseAnonKey = env.supabaseAnonKey || "test-anon-key";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

function sincronizarTokenSesion(session: Session | null) {
  if (session?.access_token) {
    sessionStorageApi.setAccessToken(session.access_token);
    return;
  }

  sessionStorageApi.clearAccessToken();
}

type ClienteSupabaseAuth = Pick<typeof supabase, "auth">;

export async function sincronizarSesionAutenticada(cliente: ClienteSupabaseAuth = supabase) {
  const { data, error } = await cliente.auth.getSession();

  if (error) {
    sessionStorageApi.clearAccessToken();
    throw error;
  }

  sincronizarTokenSesion(data.session);
  return data.session;
}

export function escucharCambiosAutenticacion(cliente: ClienteSupabaseAuth = supabase) {
  const { data } = cliente.auth.onAuthStateChange((_event, session) => {
    sincronizarTokenSesion(session);
  });

  return () => data.subscription.unsubscribe();
}

export async function iniciarSesionGoogle(redirectTo: string, cliente: ClienteSupabaseAuth = supabase) {
  const { data, error } = await cliente.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo,
      queryParams: {
        access_type: "offline",
        prompt: "consent",
      },
    },
  });

  if (error) {
    throw error;
  }

  return data.url ?? "";
}

export async function cerrarSesionAutenticada(cliente: ClienteSupabaseAuth = supabase) {
  await cliente.auth.signOut();
  sessionStorageApi.clearAccessToken();
}
