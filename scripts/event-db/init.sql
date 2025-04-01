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
