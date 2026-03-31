-- Seed Realistic Reviews for WonderStay
-- Distributed across various resorts

-- First, let's ensure we have some mock users if they don't exist
-- Note: In a real Supabase environment, you'd usually have real users. 
-- For seeding purposes, we'll assume there are at least some users or use a placeholder if RLS allows.
-- Since reviews.user_id references auth.users, we should ideally use existing IDs or 
-- just insert with a valid UUID if the constraint is not strictly enforced in the environment.

-- We will use a subquery to get resort IDs to ensure they are valid.

DO $$
DECLARE
    resort_record RECORD;
    user_id_val UUID;
    booking_id_val UUID;
    review_comments TEXT[] := ARRAY[
        'Amazing stay with beautiful views.',
        'Perfect for a relaxing weekend.',
        'Great hospitality and clean rooms.',
        'Loved the location and ambience.',
        'Highly recommended for couples.',
        'A truly luxurious experience.',
        'The staff was incredibly helpful.',
        'Exceeded all my expectations.',
        'Beautiful architecture and decor.',
        'The food was absolutely delicious.',
        'A peaceful sanctuary away from the city.',
        'Breathtaking sunrise views from the balcony.',
        'Everything was top-notch and professional.',
        'Will definitely visit again soon!',
        'The perfect blend of comfort and style.'
    ];
    author_names TEXT[] := ARRAY[
        'Arjun Mehta', 'Priya Sharma', 'Rohan Gupta', 'Ananya Singh', 'Vikram Malhotra',
        'Sneha Reddy', 'Aditya Verma', 'Ishita Kapoor', 'Karan Johar', 'Mira Nair',
        'Siddharth Roy', 'Tanvi Shah', 'Rahul Dravid', 'Zoya Akhtar', 'Varun Dhawan'
    ];
    i INTEGER;
    j INTEGER;
BEGIN
    -- Get a user ID from the profiles or auth.users if available
    SELECT id INTO user_id_val FROM auth.users LIMIT 1;
    
    -- If no user exists, we might need to skip or use a null if allowed
    -- But usually there's at least one user (the owner/admin)
    
    FOR resort_record IN SELECT id FROM public.resorts LIMIT 10 LOOP
        -- Add 4 reviews per resort to reach 40 reviews
        FOR i IN 1..4 LOOP
            -- Create a dummy booking for this review since add_review logic requires it
            -- and reviews table has booking_id column
            INSERT INTO public.bookings (listing_id, user_id, start_date, end_date, guests, total, status)
            VALUES (
                resort_record.id,
                user_id_val,
                CURRENT_DATE - (i * 10 + 5 || ' days')::interval,
                CURRENT_DATE - (i * 10 + 2 || ' days')::interval,
                2,
                10000,
                'completed'
            ) RETURNING id INTO booking_id_val;

            -- Now insert the review
            INSERT INTO public.reviews (booking_id, resort_id, user_id, author_name, comment, rating, created_at)
            VALUES (
                booking_id_val,
                resort_record.id,
                user_id_val,
                author_names[1 + floor(random() * array_length(author_names, 1))],
                review_comments[1 + floor(random() * array_length(review_comments, 1))],
                4 + floor(random() * 2), -- Rating 4 or 5
                CURRENT_TIMESTAMP - (i * 5 || ' days')::interval
            );
        END LOOP;
    END LOOP;
END $$;
