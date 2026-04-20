import { createServerClient } from "@supabase/ssr";
import { cookies, headers } from "next/headers";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const createClient = (cookieStore: Awaited<ReturnType<typeof cookies>>) => {
  const headerList = headers();
  const authHeader = headerList.get("Authorization");

  return createServerClient(
    supabaseUrl!,
    supabaseKey!,
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