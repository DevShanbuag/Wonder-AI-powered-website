-- Create messages table for chat functionality
CREATE TABLE IF NOT EXISTS public.messages (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.bookings(id) on delete cascade,
  sender_id uuid not null references auth.users(id) on delete set null,
  receiver_id uuid not null references auth.users(id) on delete set null,
  message text not null,
  created_at timestamptz not null default now()
);

-- Enable RLS for messages table
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Create index for performance
CREATE INDEX messages_booking_created_idx ON public.messages (booking_id, created_at);
