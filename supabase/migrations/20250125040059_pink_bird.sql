-- Seed data for properties
INSERT INTO properties (title, description, price, bedrooms, bathrooms, area, location, image_url, property_type)
VALUES
  ('Modern Downtown Apartment', 'Luxurious apartment with city views', 500000, 2, 2, 1200, 'Downtown', 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80', 'Apartment'),
  ('Suburban Family Home', 'Spacious home with large backyard', 750000, 4, 3, 2500, 'Suburbs', 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&q=80', 'House'),
  ('Beachfront Villa', 'Stunning oceanfront property', 1200000, 5, 4, 3500, 'Beach Area', 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80', 'Villa'),
  ('Mountain Retreat', 'Cozy cabin with mountain views', 400000, 3, 2, 1800, 'Mountain Area', 'https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?auto=format&fit=crop&q=80', 'Cabin'),
  ('City Center Loft', 'Industrial style loft apartment', 600000, 1, 1, 1000, 'City Center', 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80', 'Loft');