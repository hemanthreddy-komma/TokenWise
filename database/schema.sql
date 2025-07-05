CREATE TABLE transactions (
  id SERIAL PRIMARY KEY,
  wallet TEXT,
  amount DECIMAL,
  action TEXT,
  protocol TEXT,
  timestamp TIMESTAMP
);