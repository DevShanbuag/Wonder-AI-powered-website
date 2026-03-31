-- Update RLS policies for new features

-- Reviews Policies - Only allow insertion through RPC
DROP POLICY IF EXISTS reviews_insert_auth ON public.reviews;
CREATE POLICY reviews_insert_rpc_only ON public.reviews
  FOR INSERT TO authenticated
  WITH CHECK (false); -- Direct inserts not allowed

-- Messages Policies
CREATE POLICY messages_select_participants ON public.messages
  FOR SELECT TO authenticated
  USING (
    sender_id = auth.uid() OR 
    receiver_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.bookings b
      WHERE b.id = booking_id 
        AND (b.user_id = auth.uid() OR 
             EXISTS (
               SELECT 1 FROM public.resorts r
               WHERE r.id = b.listing_id AND r.owner_id = auth.uid()
             ))
    )
  );

CREATE POLICY messages_insert_participants ON public.messages
  FOR INSERT TO authenticated
  WITH CHECK (
    sender_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM public.bookings b
      WHERE b.id = booking_id 
        AND (b.user_id = auth.uid() OR 
             EXISTS (
               SELECT 1 FROM public.resorts r
               WHERE r.id = b.listing_id AND r.owner_id = auth.uid()
             ))
    )
  );

-- Update bookings policies to include new status
DROP POLICY IF EXISTS bookings_select_own ON public.bookings;
CREATE POLICY bookings_select_own ON public.bookings
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS bookings_select_owner_resort ON public.bookings;
CREATE POLICY bookings_select_owner_resort ON public.bookings
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.resorts 
      WHERE id = listing_id AND owner_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS bookings_modify_own ON public.bookings;
CREATE POLICY bookings_modify_own ON public.bookings
  FOR ALL TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Resorts Policies - Allow everyone to see basic info
DROP POLICY IF EXISTS resorts_select_public ON public.resorts;
CREATE POLICY resorts_select_public ON public.resorts
  FOR SELECT
  USING (true);

-- Create a view that includes host contact info only for eligible users
CREATE OR REPLACE VIEW public.resorts_with_contact AS
SELECT 
  id, owner_id, title, description, image, gallery, price, location, country, category, season, amenities, capacity_guests, capacity_beds, capacity_baths, avg_rating, review_count, owner_name, coordinates, transport_info, created_at, updated_at,
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM public.bookings b
      WHERE b.listing_id = r.id 
        AND b.user_id = auth.uid()
        AND b.status = 'confirmed'
    ) THEN host_phone
    ELSE NULL
  END as host_phone,
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM public.bookings b
      WHERE b.listing_id = r.id 
        AND b.user_id = auth.uid()
        AND b.status = 'confirmed'
    ) THEN host_email
    ELSE NULL
  END as host_email,
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM public.bookings b
      WHERE b.listing_id = r.id 
        AND b.user_id = auth.uid()
        AND b.status = 'confirmed'
    ) THEN host_whatsapp
    ELSE NULL
  END as host_whatsapp,
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM public.bookings b
      WHERE b.listing_id = r.id 
        AND b.user_id = auth.uid()
        AND b.status = 'confirmed'
    ) THEN true
    ELSE false
  END as can_view_contact
FROM public.resorts r;

-- Enable RLS on the view
ALTER VIEW public.resorts_with_contact ENABLE ROW LEVEL SECURITY;

CREATE POLICY resorts_with_contact_select_authenticated ON public.resorts_with_contact
  FOR SELECT TO authenticated
  USING (true);
