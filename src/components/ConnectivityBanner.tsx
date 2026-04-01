import { useSupabaseConnectivity } from "@/hooks/useSupabaseConnectivity";
import { toast } from "sonner";

export default function ConnectivityBanner() {
  const { connected, checked, hasEnv, retry } = useSupabaseConnectivity();
  if (!hasEnv) return null;
  if (checked && connected) return null;
  return (
    <div>
    </div>
  );
}
