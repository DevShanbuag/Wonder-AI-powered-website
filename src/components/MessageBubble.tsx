import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Message } from "@/lib/types";
import { format } from "date-fns";
import { User } from "@supabase/supabase-js";

interface MessageBubbleProps {
  message: Message;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const supabase = createClient();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  useEffect(() => {
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);
    };
    getCurrentUser();
  }, [supabase]);

  const isOwn = currentUser?.id === message.senderId;

  return (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[70%] rounded-lg px-3 py-2 ${
          isOwn
            ? "bg-primary text-primary-foreground"
            : "bg-muted"
        }`}
      >
        <p className="text-sm">{message.message}</p>
        <p className="text-xs opacity-70 mt-1">
          {format(new Date(message.createdAt), "MMM d, h:mm a")}
        </p>
      </div>
    </div>
  );
}
