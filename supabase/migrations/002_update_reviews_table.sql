-- Update reviews table to match requirements
ALTER TABLE public.reviews 
DROP COLUMN IF EXISTS listing_id,
ADD COLUMN IF NOT EXISTS resort_id uuid references public.resorts(id) on delete cascade,
ADD COLUMN IF NOT EXISTS booking_id uuid references public.bookings(id) on delete cascade,
ADD COLUMN IF NOT EXISTS user_id uuid references auth.users(id) on delete set null;

-- Remove old columns that are no longer needed
ALTER TABLE public.reviews 
DROP COLUMN IF EXISTS author_name;

-- Add unique constraint on booking_id
ALTER TABLE public.reviews 
ADD CONSTRAINT unique_booking_id UNIQUE (booking_id);

-- Update existing reviews to have resort_id from listing_id if any exist
UPDATE public.reviews 
SET resort_id = listing_id::uuid 
WHERE resort_id IS NULL AND listing_id IS NOT NULL;
