import { createServerClient } from "@supabase/ssr";
import { cookies, headers } from "next/headers";

const supabaseUrl = typeof process !== 'undefined' ? process.env?.NEXT_PUBLIC_SUPABASE_URL : undefined;
const supabaseKey = typeof process !== 'undefined' ? process.env?.NEXT_PUBLIC_SUPABASE_ANON_KEY : undefined;

export const createClient = (cookieStore: Awaited<ReturnType<typeof cookies>>) => {
  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Supabase server environment variables are missing! Check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY");
  }

  const headerList = headers();
  const authHeader = headerList.get("Authorization");

  return createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      global: {
        headers: authHeader ? { Authorization: authHeader } : undefined,
      },
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
          } catch {
            // This can be ignored
          }
        },
      },
    },
  );
};