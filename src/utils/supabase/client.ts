import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || import.meta.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const createClient = () => {
  if (!supabaseUrl || !supabaseKey) {
    console.error("Supabase environment variables are missing! Check your .env file.");
  }
  return createBrowserClient(
    supabaseUrl,
    supabaseKey,
  );
};