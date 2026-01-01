CREATE TABLE IF NOT EXISTS listing_photos (
  photo_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID NOT NULL,
  photo_url TEXT NOT NULL,
  photo_order INTEGER NOT NULL DEFAULT 0
);

