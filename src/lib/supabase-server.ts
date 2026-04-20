import { createClient } from "@supabase/supabase-js";

const url = typeof process !== 'undefined' ? process.env?.SUPABASE_URL : undefined;
const serviceKey = typeof process !== 'undefined' ? process.env?.SUPABASE_SERVICE_ROLE : undefined;

export const serverSupabase = url && serviceKey ? createClient(url, serviceKey) : null;
