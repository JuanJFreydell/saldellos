CREATE TABLE IF NOT EXISTS listing_addresses (
  listing_id UUID NOT NULL,
  address_line_1 TEXT NOT NULL,
  address_line_2 TEXT,
  neighborhood_id TEXT,
  coordinates TEXT
);
