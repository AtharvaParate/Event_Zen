#!/bin/bash

# Create directories for scripts
mkdir -p scripts/auth-db
mkdir -p scripts/event-db
mkdir -p scripts/budget-db
mkdir -p scripts/vendor-db
mkdir -p scripts/venue-db

# Auth Service DB Initialization
cat > scripts/auth-db/init.sql << 'EOF'
-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(100) NOT NULL,
  first_name VARCHAR(50),
  last_name VARCHAR(50),
  role VARCHAR(20) NOT NULL DEFAULT 'USER',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample users (password: password123)
INSERT INTO users (username, email, password, first_name, last_name, role)
VALUES 
  ('admin', 'admin@eventzen.com', '$2a$10$8ZVlfrXXWZGDMjuFZF9EH.TDN0rKVXX2qbhx0u0LZ7dqDFV6SQq6u', 'Admin', 'User', 'ADMIN'),
  ('organizer', 'organizer@eventzen.com', '$2a$10$8ZVlfrXXWZGDMjuFZF9EH.TDN0rKVXX2qbhx0u0LZ7dqDFV6SQq6u', 'Event', 'Organizer', 'ORGANIZER'),
  ('user', 'user@eventzen.com', '$2a$10$8ZVlfrXXWZGDMjuFZF9EH.TDN0rKVXX2qbhx0u0LZ7dqDFV6SQq6u', 'Regular', 'User', 'USER')
ON CONFLICT (email) DO NOTHING;
EOF

# Event Service DB Initialization
cat > scripts/event-db/init.sql << 'EOF'
-- Create events table
CREATE TABLE IF NOT EXISTS events (
  id SERIAL PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  description TEXT,
  start_date TIMESTAMP NOT NULL,
  end_date TIMESTAMP NOT NULL,
  location VARCHAR(200) NOT NULL,
  category VARCHAR(50) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'UPCOMING',
  organizer_id INT NOT NULL,
  capacity INT,
  price DECIMAL(10, 2),
  image VARCHAR(200),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample events
INSERT INTO events (title, description, start_date, end_date, location, category, status, organizer_id, capacity, price, image)
VALUES 
  ('Tech Conference 2024', 'Join us for the latest in technology innovation', '2024-09-15 09:00:00', '2024-09-16 17:00:00', 'San Francisco Convention Center', 'TECHNOLOGY', 'UPCOMING', 2, 500, 299.99, 'event-1.avif'),
  ('Music Festival', 'Annual music festival featuring top artists', '2024-07-20 12:00:00', '2024-07-22 23:00:00', 'Central Park, New York', 'MUSIC', 'UPCOMING', 2, 5000, 150.00, 'event-2.avif'),
  ('Wellness Retreat', 'Weekend wellness and mindfulness retreat', '2024-08-05 08:00:00', '2024-08-07 16:00:00', 'Mountain View Resort, Colorado', 'HEALTH', 'UPCOMING', 2, 50, 499.99, 'event-3.avif')
ON CONFLICT DO NOTHING;

-- Create ticket_types table
CREATE TABLE IF NOT EXISTS ticket_types (
  id SERIAL PRIMARY KEY,
  event_id INT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  name VARCHAR(50) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  description TEXT,
  max_quantity INT
);

-- Insert sample ticket types
INSERT INTO ticket_types (event_id, name, price, description, max_quantity)
VALUES 
  (1, 'General Admission', 50.00, 'Standard entry ticket', 400),
  (1, 'VIP', 100.00, 'Premium access with special perks', 100),
  (1, 'Early Bird', 35.00, 'Discounted rate for early registration', 50),
  (2, 'General Admission', 25.00, 'Standard entry ticket', 4500),
  (2, 'VIP', 75.00, 'Premium access with special perks', 500)
ON CONFLICT DO NOTHING;
EOF

# Budget Service DB Initialization
cat > scripts/budget-db/init.sql << 'EOF'
-- Create budgets table
CREATE TABLE IF NOT EXISTS budgets (
  id SERIAL PRIMARY KEY,
  event_id INT NOT NULL,
  name VARCHAR(100) NOT NULL,
  total_budget DECIMAL(15, 2) NOT NULL,
  current_expenses DECIMAL(15, 2) DEFAULT 0,
  current_income DECIMAL(15, 2) DEFAULT 0,
  status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
  notes TEXT,
  categories VARCHAR(50)[] DEFAULT '{}'::VARCHAR[],
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample budgets
INSERT INTO budgets (event_id, name, total_budget, current_expenses, current_income, status, notes, categories) 
VALUES 
  (1, 'Corporate Conference Budget', 25000.00, 18750.00, 30000.00, 'ACTIVE', 'Budget for annual tech conference. Sponsorships exceeding expectations.', ARRAY['Venue', 'Catering', 'Marketing', 'Staff', 'Equipment']),
  (2, 'Music Festival Budget', 15000.00, 14500.00, 15000.00, 'ACTIVE', 'Budget almost fully utilized. Consider requesting additional funds.', ARRAY['Venue', 'Catering', 'Photography', 'Decoration', 'Entertainment']),
  (3, 'Product Launch Budget', 50000.00, 35000.00, 60000.00, 'ACTIVE', 'Marketing expenses higher than anticipated but offset by additional sponsorships.', ARRAY['Venue', 'Marketing', 'Staff', 'Equipment', 'Catering', 'PR'])
ON CONFLICT DO NOTHING;

-- Create expenses table
CREATE TABLE IF NOT EXISTS expenses (
  id SERIAL PRIMARY KEY,
  budget_id INT NOT NULL REFERENCES budgets(id) ON DELETE CASCADE,
  category VARCHAR(50) NOT NULL,
  amount DECIMAL(15, 2) NOT NULL,
  description TEXT,
  vendor VARCHAR(100),
  date TIMESTAMP NOT NULL,
  payment_status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
  receipt_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample expenses
INSERT INTO expenses (budget_id, category, amount, description, vendor, date, payment_status, receipt_url)
VALUES 
  (1, 'Venue', 8000.00, 'Grand Ballroom rental for 2 days', 'Elegant Estates', '2023-04-10 00:00:00', 'PAID', 'https://example.com/receipts/venue-001.pdf'),
  (1, 'Catering', 6500.00, 'Lunch and refreshments for 200 attendees', 'Premium Catering Co.', '2023-04-10 00:00:00', 'PAID', 'https://example.com/receipts/catering-001.pdf'),
  (1, 'Marketing', 4250.00, 'Digital marketing campaign and printed materials', 'Marketing Masters', '2023-03-15 00:00:00', 'PENDING', 'https://example.com/receipts/marketing-001.pdf')
ON CONFLICT DO NOTHING;

-- Create incomes table
CREATE TABLE IF NOT EXISTS incomes (
  id SERIAL PRIMARY KEY,
  budget_id INT NOT NULL REFERENCES budgets(id) ON DELETE CASCADE,
  category VARCHAR(50) NOT NULL,
  amount DECIMAL(15, 2) NOT NULL,
  description TEXT,
  source VARCHAR(100),
  date TIMESTAMP NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample incomes
INSERT INTO incomes (budget_id, category, amount, description, source, date, status)
VALUES 
  (1, 'Ticket Sales', 20000.00, '200 tickets at $100 each', 'EventBrite', '2023-03-30 00:00:00', 'RECEIVED'),
  (1, 'Sponsorship', 10000.00, 'Gold level sponsorship from TechCorp', 'TechCorp Inc.', '2023-02-15 00:00:00', 'RECEIVED')
ON CONFLICT DO NOTHING;
EOF

# Vendor Service DB Initialization
cat > scripts/vendor-db/init.sql << 'EOF'
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
EOF

# Venue Service DB Initialization
cat > scripts/venue-db/init.sql << 'EOF'
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
EOF

echo "Database initialization scripts created in the scripts/ directory"
echo "Run docker-compose up to start the services with initialized databases" 