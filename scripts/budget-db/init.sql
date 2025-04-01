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
