-- 20 Realistic Resort Listings for WonderStay with varied ratings (3.7 - 4.9)
-- Locations: Udaipur, Leh, Rishikesh, Kasol, Shimla, Ooty, Coorg, Munnar, Goa, Wayanad, Jaisalmer, Havelock Island, Alibaug, Darjeeling, Manali

INSERT INTO public.resorts 
  (title, description, image, gallery, price, location, country, category, season, amenities, capacity_guests, capacity_beds, capacity_baths, avg_rating, review_count, owner_name, coordinates, transport_info)
VALUES
  (
    'The Grand Udaipur Palace', 
    'Experience royal luxury in this heritage palace overlooking Lake Pichola. Features intricate marble carvings, lush gardens, and a world-class spa. Perfect for a majestic getaway in the City of Lakes.',
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1600&q=80',
    ARRAY[
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=1600&q=80'
    ],
    18500, 'Udaipur', 'India', 'Others', 'Summer', 
    ARRAY['WiFi', 'Pool', 'AC', 'Spa', 'Kitchen', 'TV', 'Parking'], 
    4, 2, 2, 4.9, 45, 'Rajesh Singh', ARRAY[73.6824, 24.5854], 
    '{"railway": "Udaipur City Railway Station (3 km)", "bus": "Udaipur Bus Stand (4 km)", "airport": "Maharana Pratap Airport (22 km)"}'::jsonb
  ),
  (
    'Leh Moonland Camp', 
    'Luxury glamping in the high-altitude desert of Ladakh. Stay in insulated tents with panoramic views of the Stok Kangri range. Authentic Ladakhi hospitality and bonfire evenings included.',
    'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1600&q=80',
    ARRAY[
      'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80'
    ],
    9500, 'Leh', 'India', 'Mountain', 'Summer', 
    ARRAY['Breakfast', 'Parking', 'Fireplace', 'WiFi'], 
    2, 1, 1, 4.2, 32, 'Stanzin Dorje', ARRAY[77.5771, 34.1526], 
    '{"railway": "N/A", "bus": "Leh Bus Stand (5 km)", "airport": "Kushok Bakula Rimpochee Airport (8 km)"}'::jsonb
  ),
  (
    'Rishikesh Ganges Retreat', 
    'A peaceful sanctuary on the banks of the holy Ganges. Offers yoga sessions, organic meals, and river-view balconies. Find your inner peace in the yoga capital of the world.',
    'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=1600&q=80',
    ARRAY[
      'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=1600&q=80'
    ],
    7200, 'Rishikesh', 'India', 'Others', 'All', 
    ARRAY['WiFi', 'Breakfast', 'Spa', 'Garden', 'Parking'], 
    2, 1, 1, 4.5, 56, 'Amit Sharma', ARRAY[78.2676, 30.0869], 
    '{"railway": "Rishikesh Railway Station (6 km)", "bus": "Rishikesh Bus Stand (5 km)", "airport": "Jolly Grant Airport (20 km)"}'::jsonb
  ),
  (
    'Kasol Riverside Chalet', 
    'Cozy wooden chalet situated right beside the Parvati River. Hear the soothing sound of water and enjoy the fresh mountain air. Perfect for backpackers and nature lovers.',
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=80',
    ARRAY[
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80'
    ],
    5800, 'Kasol', 'India', 'Mountain', 'Summer', 
    ARRAY['WiFi', 'Fireplace', 'Kitchen', 'Pet Friendly', 'Parking'], 
    4, 2, 1, 3.8, 88, 'Vikram Negi', ARRAY[77.3156, 32.0100], 
    '{"railway": "Joginder Nagar (125 km)", "bus": "Kasol Bus Stand (1 km)", "airport": "Bhuntar Airport (31 km)"}'::jsonb
  ),
  (
    'Shimla Pine View Estate', 
    'Elegant colonial-style estate surrounded by dense pine forests. Offers breathtaking views of the Shimla valley and the Himalayas. Experience the charm of the British era with modern comforts.',
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1600&q=80',
    ARRAY[
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1600&q=80'
    ],
    8900, 'Shimla', 'India', 'Hill Station', 'Winter', 
    ARRAY['WiFi', 'AC', 'Breakfast', 'Fireplace', 'TV', 'Parking'], 
    6, 3, 2, 4.6, 112, 'Sanjay Verma', ARRAY[77.1734, 31.1048], 
    '{"railway": "Shimla Railway Station (4 km)", "bus": "ISBT Shimla (5 km)", "airport": "Jubarhatti Airport (22 km)"}'::jsonb
  ),
  (
    'Ooty Heritage Bungalow', 
    'Charming heritage bungalow nestled in the Nilgiri hills. Surrounded by tea gardens and colorful flower beds. Enjoy homemade Nilgiri tea on the sprawling veranda.',
    'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&w=1600&q=80',
    ARRAY[
      'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1600&q=80'
    ],
    7500, 'Ooty', 'India', 'Hill Station', 'Summer', 
    ARRAY['WiFi', 'Breakfast', 'Garden', 'Fireplace', 'Parking'], 
    4, 2, 2, 4.1, 95, 'Lakshmi Iyer', ARRAY[76.6958, 11.4102], 
    '{"railway": "Udagamandalam (Ooty) Station (2 km)", "bus": "Ooty Bus Stand (3 km)", "airport": "Coimbatore Airport (88 km)"}'::jsonb
  ),
  (
    'Coorg Coffee Estate Villa', 
    'Immerse yourself in the aroma of coffee in this luxury villa located within a private estate. Offers plantation walks, bird watching, and authentic Kodava cuisine.',
    'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?auto=format&fit=crop&w=1600&q=80',
    ARRAY[
      'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1482192505345-5655af888cc4?auto=format&fit=crop&w=1600&q=80'
    ],
    11000, 'Coorg', 'India', 'Others', 'Monsoon', 
    ARRAY['WiFi', 'Breakfast', 'Pool', 'Garden', 'Parking'], 
    8, 4, 4, 4.7, 134, 'Kaveri Muthappa', ARRAY[75.7378, 12.4244], 
    '{"railway": "Mysuru Junction (120 km)", "bus": "Madikeri Bus Stand (10 km)", "airport": "Kannur International Airport (92 km)"}'::jsonb
  ),
  (
    'Munnar Mist Valley Resort', 
    'Perched on a hillside, this resort offers panoramic views of the misty tea gardens of Munnar. Features a sky deck for sunrise views and cozy fireplaces in every room.',
    'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&w=1600&q=80',
    ARRAY[
      'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1600&q=80'
    ],
    6800, 'Munnar', 'India', 'Hill Station', 'Summer', 
    ARRAY['WiFi', 'Breakfast', 'Fireplace', 'Garden', 'Parking'], 
    4, 2, 1, 3.9, 78, 'Mathew Jacob', ARRAY[77.0595, 10.0889], 
    '{"railway": "Aluva Railway Station (110 km)", "bus": "Munnar Bus Stand (5 km)", "airport": "Cochin International Airport (108 km)"}'::jsonb
  ),
  (
    'Goa Palm Grove Resort', 
    'Tropical paradise located just steps away from the pristine beaches of South Goa. Features private beach access, a lagoon-style pool, and sunset yoga sessions.',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80',
    ARRAY[
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=1600&q=80'
    ],
    12500, 'Goa', 'India', 'BeachFront', 'All', 
    ARRAY['WiFi', 'AC', 'Pool', 'Breakfast', 'Spa', 'TV', 'Parking'], 
    6, 3, 2, 4.4, 156, 'Anita Fernandes', ARRAY[73.8567, 15.2993], 
    '{"railway": "Madgaon Junction (15 km)", "bus": "Margao Bus Stand (12 km)", "airport": "Dabolim Airport (30 km)"}'::jsonb
  ),
  (
    'Wayanad Forest Treehouse', 
    'Sleep under the canopy in this luxurious treehouse built into a massive ancient tree. Surrounded by lush rainforest, it offers total privacy and a unique connection with nature.',
    'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=1600&q=80',
    ARRAY[
      'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=1600&q=80'
    ],
    10500, 'Wayanad', 'India', 'Treehouse', 'Monsoon', 
    ARRAY['WiFi', 'Breakfast', 'Garden', 'Parking'], 
    2, 1, 1, 4.8, 64, 'Meera Nair', ARRAY[76.1320, 11.6854], 
    '{"railway": "Kozhikode Railway Station (90 km)", "bus": "Kalpetta Bus Stand (12 km)", "airport": "Calicut International Airport (95 km)"}'::jsonb
  ),
  (
    'Desert Escape', 
    'Experience the magic of the dunes in this luxury desert escape in the heart of the Thar Desert. Perfect for stargazing and authentic desert hospitality.',
    'https://images.unsplash.com/photo-1509059852496-f3822ae057bf?auto=format&fit=crop&w=1600&q=80',
    ARRAY[
      'https://images.unsplash.com/photo-1509059852496-f3822ae057bf?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1473580044384-7ba9967e16a0?auto=format&fit=crop&w=1600&q=80'
    ],
    8200, 'Jaisalmer', 'India', 'Desert', 'Winter', 
    ARRAY['Breakfast', 'AC', 'Parking', 'WiFi'], 
    2, 1, 1, 4.3, 52, 'Vikram Singh', ARRAY[70.9126, 26.9157], 
    '{"railway": "Jaisalmer Railway Station (15 km)", "bus": "Jaisalmer Bus Stand (14 km)", "airport": "Jaisalmer Airport (25 km)"}'::jsonb
  ),
  (
    'Andaman Coral Reef Resort', 
    'Sustainable luxury on a private island. Surrounded by coral reefs and turquoise waters, this resort is perfect for snorkeling, kayaking, and complete disconnection.',
    'https://images.unsplash.com/photo-1505881502353-a1986add3762?auto=format&fit=crop&w=1600&q=80',
    ARRAY[
      'https://images.unsplash.com/photo-1505881502353-a1986add3762?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=1600&q=80'
    ],
    19500, 'Havelock Island', 'India', 'Island', 'All', 
    ARRAY['WiFi', 'AC', 'Pool', 'Breakfast', 'Spa', 'Gym'], 
    4, 2, 2, 4.9, 93, 'Anita Das', ARRAY[92.9876, 12.0345], 
    '{"railway": "N/A", "bus": "N/A", "airport": "Port Blair Airport (Ferry required)"}'::jsonb
  ),
  (
    'Alibaug Ocean Breeze Villa', 
    'A modern minimalist villa with spectacular views of the Arabian Sea. Features a private infinity pool and large decks for breezy evenings. Perfect for weekend getaways from Mumbai.',
    'https://images.unsplash.com/photo-1496417263034-38ec4f0b665a?auto=format&fit=crop&w=1600&q=80',
    ARRAY[
      'https://images.unsplash.com/photo-1496417263034-38ec4f0b665a?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=1600&q=80'
    ],
    14000, 'Alibaug', 'India', 'BeachFront', 'All', 
    ARRAY['WiFi', 'Pool', 'AC', 'Kitchen', 'Parking'], 
    8, 4, 3, 4.2, 86, 'Priya Patel', ARRAY[72.8722, 18.6414], 
    '{"railway": "Panvel Railway Station (38 km)", "bus": "Alibaug Bus Depot (4 km)", "airport": "Chhatrapati Shivaji Maharaj Airport (95 km)"}'::jsonb
  ),
  (
    'Darjeeling Cloud 9 Lodge', 
    'Experience the magic of the Himalayas in this colonial-style lodge surrounded by tea gardens. Offers breathtaking views of Mt. Kanchenjunga and cozy fireplace evenings.',
    'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&w=1600&q=80',
    ARRAY[
      'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1600&q=80'
    ],
    7800, 'Darjeeling', 'India', 'Hill Station', 'Summer', 
    ARRAY['WiFi', 'Breakfast', 'Garden', 'Fireplace', 'Parking'], 
    4, 2, 2, 4.5, 142, 'Suresh Nair', ARRAY[88.2636, 27.0360], 
    '{"railway": "New Jalpaiguri (NJP) (70 km)", "bus": "Darjeeling Bus Stand (3 km)", "airport": "Bagdogra Airport (75 km)"}'::jsonb
  ),
  (
    'Manali Cedar Forest Cabins', 
    'Wooden cabins tucked away in dense cedar forests. Offers total seclusion and stunning views of the Beas River valley. Ideal for writers and nature enthusiasts.',
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1600&q=80',
    ARRAY[
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1600&q=80'
    ],
    9200, 'Manali', 'India', 'Mountain', 'Winter', 
    ARRAY['WiFi', 'Fireplace', 'Kitchen', 'Parking', 'TV'], 
    4, 2, 2, 4.7, 124, 'Rahul Sharma', ARRAY[77.1892, 32.2396], 
    '{"railway": "Joginder Nagar Station (165 km)", "bus": "Manali Bus Stand (2.5 km)", "airport": "Kullu-Manali Airport (50 km)"}'::jsonb
  ),
  (
    'Udaipur Lakeview Haveli', 
    'A restored haveli with stunning views of Lake Pichola. Features traditional Rajasthani architecture, a rooftop restaurant, and luxurious rooms with antique furniture.',
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1600&q=80',
    ARRAY[
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=1600&q=80'
    ],
    16500, 'Udaipur', 'India', 'Others', 'Summer', 
    ARRAY['WiFi', 'Pool', 'AC', 'Kitchen', 'TV', 'Parking'], 
    4, 2, 2, 4.8, 52, 'Vikram Singh', ARRAY[73.6824, 24.5854], 
    '{"railway": "Udaipur Railway Station (2 km)", "bus": "Udaipur Bus Stand (3 km)", "airport": "Maharana Pratap Airport (22 km)"}'::jsonb
  ),
  (
    'Rishikesh Yoga Sanctuary', 
    'A spiritual retreat offering daily yoga and meditation classes. Located in a quiet area of Rishikesh, it provides a peaceful environment for self-discovery and relaxation.',
    'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=1600&q=80',
    ARRAY[
      'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=1600&q=80'
    ],
    6500, 'Rishikesh', 'India', 'Others', 'All', 
    ARRAY['WiFi', 'Breakfast', 'Garden', 'Spa', 'Parking'], 
    2, 1, 1, 4.1, 42, 'Amit Sharma', ARRAY[78.2676, 30.0869], 
    '{"railway": "Rishikesh Railway Station (5 km)", "bus": "Rishikesh Bus Stand (4 km)", "airport": "Jolly Grant Airport (20 km)"}'::jsonb
  ),
  (
    'Goa Sunset Beach Villa', 
    'Stunning villa with a private infinity pool and direct access to a secluded beach. Enjoy spectacular sunsets from your private deck. Perfect for a romantic getaway.',
    'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=1600&q=80',
    ARRAY[
      'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1600&q=80'
    ],
    15500, 'Goa', 'India', 'BeachFront', 'Summer', 
    ARRAY['WiFi', 'AC', 'Pool', 'Kitchen', 'TV', 'Parking'], 
    6, 3, 3, 4.6, 118, 'Maya D''Souza', ARRAY[73.9512, 15.2993], 
    '{"railway": "Madgaon Junction (10 km)", "bus": "Margao Bus Stand (8 km)", "airport": "Dabolim Airport (25 km)"}'::jsonb
  }
ON CONFLICT DO NOTHING;

