-- Update booking status enum to include payment states
DROP TYPE IF EXISTS public.booking_status_enum cascade;
CREATE TYPE public.booking_status_enum as enum ('pending', 'confirmed', 'upcoming', 'ongoing', 'completed', 'cancelled');

-- Add payment-related columns to bookings table
ALTER TABLE public.bookings 
ADD COLUMN IF NOT EXISTS stripe_payment_id text,
ADD COLUMN IF NOT EXISTS payment_amount integer;

-- Update existing bookings to have confirmed status if they were upcoming
UPDATE public.bookings 
SET status = 'confirmed' 
WHERE status = 'upcoming';
