export const env = {
  apiUrl: import.meta.env.VITE_API_URL ?? "http://localhost:8787",
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL ?? "http://localhost:54321",
  supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY ?? "test-anon-key"
};
