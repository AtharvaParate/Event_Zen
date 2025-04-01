-- Create venues table
CREATE TABLE IF NOT EXISTS venues (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  address VARCHAR(255) NOT NULL,
  city VARCHAR(50) NOT NULL,
  state VARCHAR(50) NOT NULL,
  zip_code VARCHAR(20) NOT NULL,
  country VARCHAR(50) NOT NULL DEFAULT 'USA',
  capacity INT NOT NULL,
  price_per_hour DECIMAL(10, 2) NOT NULL,
  description TEXT,
  amenities VARCHAR(50)[] DEFAULT '{}'::VARCHAR[],
  images VARCHAR(255)[] DEFAULT '{}'::VARCHAR[],
  contact_email VARCHAR(100),
  contact_phone VARCHAR(20),
  available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample venues
INSERT INTO venues (name, address, city, state, zip_code, capacity, price_per_hour, description, amenities, images, contact_email, contact_phone)
VALUES 
  ('Grand Ballroom', '123 Main St', 'San Francisco', 'CA', '94105', 500, 1000.00, 'Elegant ballroom for corporate events and weddings', ARRAY['Wifi', 'AV Equipment', 'Catering', 'Parking'], ARRAY['venue1.jpg', 'venue1-2.jpg'], 'info@grandballroom.com', '555-123-4567'),
  ('Garden Terrace', '456 Park Ave', 'Napa', 'CA', '94558', 200, 800.00, 'Beautiful outdoor venue with stunning views', ARRAY['Outdoor Space', 'Tent', 'Parking', 'Restrooms'], ARRAY['venue2.jpg'], 'bookings@gardenterrace.com', '555-234-5678'),
  ('Tech Hub Conference Center', '789 Market St', 'San Francisco', 'CA', '94103', 300, 1200.00, 'Modern conference space with cutting-edge technology', ARRAY['Wifi', 'AV Equipment', 'Breakout Rooms', 'Catering', 'Parking'], ARRAY['venue3.jpg', 'venue3-2.jpg', 'venue3-3.jpg'], 'events@techhub.com', '555-345-6789')
ON CONFLICT DO NOTHING;

-- Create venue_bookings table
CREATE TABLE IF NOT EXISTS venue_bookings (
  id SERIAL PRIMARY KEY,
  venue_id INT NOT NULL REFERENCES venues(id) ON DELETE CASCADE,
  event_id INT NOT NULL,
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP NOT NULL,
  total_price DECIMAL(10, 2) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample bookings
INSERT INTO venue_bookings (venue_id, event_id, start_time, end_time, total_price, status)
VALUES 
  (1, 1, '2024-09-15 08:00:00', '2024-09-16 18:00:00', 34000.00, 'CONFIRMED'),
  (3, 3, '2024-08-05 07:00:00', '2024-08-07 19:00:00', 86400.00, 'CONFIRMED')
ON CONFLICT DO NOTHING;
