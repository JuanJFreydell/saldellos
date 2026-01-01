CREATE TABLE IF NOT EXISTS listings (
  listing_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL,
  description TEXT,
  price TEXT,
  create_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  subcategory_id UUID,
  title TEXT,
  status TEXT,
  thumbnail TEXT,
);