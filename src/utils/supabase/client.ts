import { createBrowserClient } from "@supabase/ssr";

const getEnv = (key: string): string => {
  if (typeof window === 'undefined') return ""; // Client-only helper

  // Try literal access first for better bundler support
  if (key === 'NEXT_PUBLIC_SUPABASE_URL') {
    const nextUrl = typeof process !== 'undefined' ? process.env?.NEXT_PUBLIC_SUPABASE_URL : undefined;
    const viteUrl = (import.meta as any).env?.NEXT_PUBLIC_SUPABASE_URL;
    return (nextUrl || viteUrl || "") as string;
  }
  if (key === 'NEXT_PUBLIC_SUPABASE_ANON_KEY') {
    const nextKey = typeof process !== 'undefined' ? process.env?.NEXT_PUBLIC_SUPABASE_ANON_KEY : undefined;
    const viteKey = (import.meta as any).env?.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    return (nextKey || viteKey || "") as string;
  }

  // Fallback to dynamic access
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    return process.env[key] as string;
  }
  if (typeof import.meta !== 'undefined' && (import.meta as any).env && (import.meta as any).env[key]) {
    return (import.meta as any).env[key] as string;
  }
  return "";
};

export const createClient = () => {
  const supabaseUrl = getEnv('NEXT_PUBLIC_SUPABASE_URL');
  const supabaseKey = getEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY');

  if (!supabaseUrl || !supabaseKey) {
    console.warn("Supabase credentials missing in createClient! Check .env.local", {
      hasUrl: !!supabaseUrl,
      hasKey: !!supabaseKey,
      urlPrefix: supabaseUrl?.substring(0, 10),
      keyPrefix: supabaseKey?.substring(0, 10)
    });
  }

  return createBrowserClient(
    supabaseUrl,
    supabaseKey,
  );
};