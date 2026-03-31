-- Create RPC function for adding reviews with validation
CREATE OR REPLACE FUNCTION public.add_review(
  booking_id uuid,
  rating integer,
  comment text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  booking_user_id uuid;
  booking_status booking_status_enum;
  booking_check_out date;
  existing_review_id uuid;
BEGIN
  -- Get booking details and validate ownership
  SELECT user_id, status, end_date
  INTO booking_user_id, booking_status, booking_check_out
  FROM public.bookings
  WHERE id = add_review.booking_id;
  
  -- Validate booking exists and belongs to current user
  IF booking_user_id IS NULL OR booking_user_id != auth.uid() THEN
    RAISE EXCEPTION 'Booking not found or access denied';
  END IF;
  
  -- Validate booking status is completed
  IF booking_status != 'completed' THEN
    RAISE EXCEPTION 'Booking must be completed to leave a review';
  END IF;
  
  -- Validate checkout date is in the past
  IF booking_check_out >= CURRENT_DATE THEN
    RAISE EXCEPTION 'Stay must be completed to leave a review';
  END IF;
  
  -- Check for existing review
  SELECT id INTO existing_review_id
  FROM public.reviews
  WHERE booking_id = add_review.booking_id;
  
  IF existing_review_id IS NOT NULL THEN
    RAISE EXCEPTION 'Review already exists for this booking';
  END IF;
  
  -- Insert the review
  INSERT INTO public.reviews (booking_id, resort_id, user_id, rating, comment)
  SELECT 
    add_review.booking_id,
    listing_id,
    auth.uid(),
    add_review.rating,
    add_review.comment
  FROM public.bookings
  WHERE id = add_review.booking_id;
  
END;
$$;

-- Create RPC function to check resort availability
CREATE OR REPLACE FUNCTION public.check_resort_availability(
  resort_id uuid,
  checkin_date date,
  checkout_date date,
  exclude_booking_id uuid DEFAULT NULL
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  conflicting_bookings integer;
BEGIN
  -- Check for overlapping bookings
  SELECT COUNT(*)
  INTO conflicting_bookings
  FROM public.bookings
  WHERE listing_id = check_resort_availability.resort_id
    AND status IN ('confirmed', 'completed', 'upcoming', 'ongoing')
    AND (exclude_booking_id IS NULL OR id != exclude_booking_id)
    AND (
      (checkin_date < end_date) AND (checkout_date > start_date)
    );
  
  -- Return true if available (no conflicts)
  RETURN conflicting_bookings = 0;
END;
$$;

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION public.add_review TO authenticated;
GRANT EXECUTE ON FUNCTION public.check_resort_availability TO authenticated;
