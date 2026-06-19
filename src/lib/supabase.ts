import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured ? createClient(supabaseUrl, supabaseAnonKey) : null;

if (!isSupabaseConfigured) {
  console.warn(
    "Supabase is not configured. The app will run in offline/local storage mode. " +
      "To connect to a cloud database, please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY " +
      "in your environment variables or a .env file.",
  );
}
