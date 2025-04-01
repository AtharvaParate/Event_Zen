-- Create vendors table
CREATE TABLE IF NOT EXISTS vendors (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  phone VARCHAR(20),
  type VARCHAR(50) NOT NULL,
  description TEXT,
  service_areas VARCHAR(50)[] DEFAULT '{}'::VARCHAR[],
  price_range VARCHAR(10),
  website VARCHAR(255),
  social_media JSONB DEFAULT '{}'::JSONB,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample vendors
INSERT INTO vendors (name, email, phone, type, description, service_areas, price_range, website)
VALUES 
  ('Premium Catering Co.', 'info@premiumcatering.com', '555-123-4567', 'CATERING', 'Premium catering services for all types of events', ARRAY['San Francisco', 'Oakland', 'San Jose'], '$$$', 'https://premiumcatering.example.com'),
  ('Event Photography Masters', 'contact@eventphotography.com', '555-987-6543', 'PHOTOGRAPHY', 'Professional photography services for weddings, corporate events, and more', ARRAY['San Francisco', 'Napa Valley', 'Monterey'], '$$', 'https://eventphotography.example.com'),
  ('Elegant Estates', 'bookings@elegantestates.com', '555-456-7890', 'VENUE', 'Beautiful venues for weddings and corporate events', ARRAY['Napa Valley', 'Sonoma', 'San Francisco'], '$$$$', 'https://elegantestates.example.com')
ON CONFLICT DO NOTHING;

-- Create vendor_reviews table
CREATE TABLE IF NOT EXISTS vendor_reviews (
  id SERIAL PRIMARY KEY,
  vendor_id INT NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
  rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  reviewer VARCHAR(100) NOT NULL,
  date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample reviews
INSERT INTO vendor_reviews (vendor_id, rating, comment, reviewer, date)
VALUES 
  (1, 5, 'Excellent service and delicious food!', 'John Smith', '2023-02-15 10:30:00'),
  (2, 4, 'Great photos, very professional team', 'Emily Johnson', '2023-03-10 15:45:00'),
  (3, 5, 'Stunning venue, perfect for our wedding!', 'Sarah Williams', '2023-02-28 16:20:00')
ON CONFLICT DO NOTHING;
