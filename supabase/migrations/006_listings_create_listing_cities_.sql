CREATE TABLE IF NOT EXISTS listing_cities (
  city_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  city_name TEXT,
  country_id TEXT
);
