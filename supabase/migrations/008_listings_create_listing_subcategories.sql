CREATE TABLE IF NOT EXISTS listing_subcategories (
  subcategory_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subcategory_name TEXT,
  category_id UUID
);
