import { useSupabaseConnectivity } from "@/hooks/useSupabaseConnectivity";
import { toast } from "sonner";

export default function ConnectivityBanner() {
  const { connected, checked, hasEnv, retry } = useSupabaseConnectivity();
  
  if (!hasEnv) {
    return (
      <div className="bg-destructive/10 text-destructive text-xs py-2 px-4 text-center border-b border-destructive/20">
        ⚠️ <strong>Database Configuration Missing:</strong> Please check your .env file and restart the server.
      </div>
    );
  }

  if (checked && !connected) {
    return (
      <div className="bg-warning/10 text-warning-foreground text-xs py-2 px-4 text-center border-b border-warning/20 flex items-center justify-center gap-3">
        <span>⚠️ <strong>Database Unreachable:</strong> Could not connect to Supabase.</span>
        <button onClick={() => retry()} className="underline font-bold hover:opacity-80">Retry Connection</button>
      </div>
    );
  }

  return null;
}
