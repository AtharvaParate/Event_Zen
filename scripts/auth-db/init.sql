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
