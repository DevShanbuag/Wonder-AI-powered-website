import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (typeof process !== 'undefined' ? process.env?.NEXT_PUBLIC_SUPABASE_URL : undefined) || "";
const supabaseServiceRoleKey = (typeof process !== 'undefined' ? process.env?.SUPABASE_SERVICE_ROLE : undefined) || "";

export const createAdminClient = () => {
  if (!supabaseUrl || !supabaseServiceRoleKey) {
    console.error("Supabase Admin environment variables are missing!");
  }
  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
};
