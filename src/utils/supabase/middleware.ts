import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

const supabaseUrl = typeof process !== 'undefined' ? process.env?.NEXT_PUBLIC_SUPABASE_URL : undefined;
const supabaseKey = typeof process !== 'undefined' ? process.env?.NEXT_PUBLIC_SUPABASE_ANON_KEY : undefined;

export const createClient = (request: NextRequest) => {
  if (!supabaseUrl || !supabaseKey) {
    // If env vars are missing, we just return the normal response but warn
    console.error("Supabase middleware environment variables are missing!");
    return NextResponse.next({
      request: {
        headers: request.headers,
      },
    });
  }

  // Create an unmodified response
  let supabaseResponse = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    },
  );

  return supabaseResponse
};