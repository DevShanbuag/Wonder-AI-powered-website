import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const hasSupabaseEnv = Boolean(supabaseUrl && supabaseAnonKey);

let supabaseInstance: SupabaseClient | null = null;

if (hasSupabaseEnv) {
  try {
    supabaseInstance = createClient(supabaseUrl as string, supabaseAnonKey as string, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
  } catch (error) {
    console.error("Failed to initialize Supabase client:", error);
  }
} else {
  console.warn("Supabase configuration missing! Please check your .env.local file.");
}

export const supabase = supabaseInstance;

export const supabaseRestUrl: string | null = hasSupabaseEnv ? `${supabaseUrl}/rest/v1/` : null;

let _connectivityChecked = false;
let _connectivityOk = true;

export async function ensureSupabaseConnectivity(): Promise<boolean> {
  if (!hasSupabaseEnv || !supabaseRestUrl) {
    console.warn("⚠️ Cannot check connectivity: Supabase environment variables missing.");
    return false;
  }
  if (_connectivityChecked && _connectivityOk) return _connectivityOk;
  _connectivityChecked = true;
  
  try {
    const probe = await fetch(supabaseRestUrl as string, {
      method: "GET",
      headers: { apikey: supabaseAnonKey as string },
      mode: "cors",
      cache: "no-store",
    });

    const isReachable = probe.ok || probe.status === 401 || probe.status === 404;
    
    if (isReachable) {
      _connectivityOk = true;
    } else {
      console.warn(`📡 Supabase returned status ${probe.status} - might be unreachable`);
      _connectivityOk = false;
    }
  } catch (error) {
    console.error("📡 Supabase connection error:", error);
    _connectivityOk = false;
  }
  
  return _connectivityOk;
}
