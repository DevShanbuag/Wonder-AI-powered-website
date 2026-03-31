-- Replace Stripe payment fields with Razorpay fields
ALTER TABLE public.bookings 
DROP COLUMN IF EXISTS stripe_payment_id,
ADD COLUMN IF NOT EXISTS razorpay_payment_id text;
