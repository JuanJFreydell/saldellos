CREATE TABLE IF NOT EXISTS listing_categories (
  category_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_name TEXT
);
