import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";
import type { Env } from "../config/env";

export function createSupabaseAdmin(env: Env) {
  return createClient<Database>(env.SUPABASE_URL, env.SUPABASE_SERVER_KEY, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });
}

export function createSupabaseAuthClient(env: Env, accessToken: string) {
  return createClient<Database>(env.SUPABASE_URL, env.SUPABASE_PUBLISHABLE_KEY, {
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
