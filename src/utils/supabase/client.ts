import { createBrowserClient } from "@supabase/ssr";

const getEnv = (key: string): string => {
  // Try Next.js process.env first
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    return process.env[key] as string;
  }
  // Try Vite import.meta.env as fallback
  // @ts-ignore
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[key]) {
    // @ts-ignore
    return import.meta.env[key] as string;
  }
  return "";
};

const supabaseUrl = getEnv('NEXT_PUBLIC_SUPABASE_URL');
const supabaseKey = getEnv('NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY');

export const createClient = () => {
  return createBrowserClient(
    supabaseUrl,
    supabaseKey,
  );
};