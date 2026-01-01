create table if not exists listing_neighborhoods (
  neighborhood_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  neighborhood_name TEXT,
  city_id TEXT
);