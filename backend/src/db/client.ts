import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";
import type { Env } from "../config/env";

export function createSupabaseAdmin(env: Env) {
  return createClient<Database>(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });
}

export function createSupabaseAuthClient(env: Env, accessToken: string) {
  return createClient<Database>(env.SUPABASE_URL, env.SUPABASE_ANON_KEY, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    },
    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }
  });
}
