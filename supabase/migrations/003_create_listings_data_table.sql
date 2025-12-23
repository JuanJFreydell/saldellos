CREATE TABLE IF NOT EXISTS listings (
  listing_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID,
  title TEXT,
  description TEXT,
  neighborhood_id TEXT,
  listing_date TIMESTAMP,
  number_of_prints TEXT,
  number_of_visits TEXT,
  status TEXT NOT NULL DEFAULT 'active'
);
