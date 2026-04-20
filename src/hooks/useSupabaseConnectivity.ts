import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

export function useSupabaseConnectivity() {
  const supabase = createClient();
  const [connected, setConnected] = useState<boolean>(false);
  const [checked, setChecked] = useState<boolean>(false);

  const check = async () => {
    try {
      const { data, error } = await supabase.from("resorts").select("id").limit(1);
      setConnected(!error && data !== null);
    } catch {
      setConnected(false);
    }
    setChecked(true);
  };

  useEffect(() => {
    check();
  }, [supabase]);

  const hasEnv = Boolean(
    ((typeof process !== 'undefined' ? process.env?.NEXT_PUBLIC_SUPABASE_URL : undefined) || import.meta.env.NEXT_PUBLIC_SUPABASE_URL) && 
    ((typeof process !== 'undefined' ? process.env?.NEXT_PUBLIC_SUPABASE_ANON_KEY : undefined) || import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  );

  return { connected, checked, hasEnv, retry: check };
}
