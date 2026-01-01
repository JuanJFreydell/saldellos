CREATE TABLE IF NOT EXISTS listing_standard_materials (
  material_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL
);
