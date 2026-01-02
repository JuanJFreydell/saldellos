-- Seed "para la venta" category and home furnishings/decor subcategories in Spanish

-- 1. Insert "para la venta" category if it doesn't exist
INSERT INTO listing_categories (category_id, category_name)
SELECT gen_random_uuid(), 'para la venta'
WHERE NOT EXISTS (SELECT 1 FROM listing_categories WHERE category_name = 'para la venta');

-- 2. Insert subcategories for home furnishings and decor
DO $$
DECLARE
  categoria_id UUID;
BEGIN
  SELECT category_id INTO categoria_id FROM listing_categories WHERE category_name = 'para la venta' LIMIT 1;
  
  INSERT INTO listing_subcategories (subcategory_id, subcategory_name, category_id)
  SELECT gen_random_uuid(), 'Muebles de sala', categoria_id
  WHERE NOT EXISTS (SELECT 1 FROM listing_subcategories WHERE subcategory_name = 'Muebles de sala' AND category_id = categoria_id);
  
  INSERT INTO listing_subcategories (subcategory_id, subcategory_name, category_id)
  SELECT gen_random_uuid(), 'Muebles de comedor', categoria_id
  WHERE NOT EXISTS (SELECT 1 FROM listing_subcategories WHERE subcategory_name = 'Muebles de comedor' AND category_id = categoria_id);
  
  INSERT INTO listing_subcategories (subcategory_id, subcategory_name, category_id)
  SELECT gen_random_uuid(), 'Muebles de dormitorio', categoria_id
  WHERE NOT EXISTS (SELECT 1 FROM listing_subcategories WHERE subcategory_name = 'Muebles de dormitorio' AND category_id = categoria_id);
  
  INSERT INTO listing_subcategories (subcategory_id, subcategory_name, category_id)
  SELECT gen_random_uuid(), 'Muebles de oficina', categoria_id
  WHERE NOT EXISTS (SELECT 1 FROM listing_subcategories WHERE subcategory_name = 'Muebles de oficina' AND category_id = categoria_id);
  
  INSERT INTO listing_subcategories (subcategory_id, subcategory_name, category_id)
  SELECT gen_random_uuid(), 'Sofás y sillones', categoria_id
  WHERE NOT EXISTS (SELECT 1 FROM listing_subcategories WHERE subcategory_name = 'Sofás y sillones' AND category_id = categoria_id);
  
  INSERT INTO listing_subcategories (subcategory_id, subcategory_name, category_id)
  SELECT gen_random_uuid(), 'Mesas y escritorios', categoria_id
  WHERE NOT EXISTS (SELECT 1 FROM listing_subcategories WHERE subcategory_name = 'Mesas y escritorios' AND category_id = categoria_id);
  
  INSERT INTO listing_subcategories (subcategory_id, subcategory_name, category_id)
  SELECT gen_random_uuid(), 'Sillas', categoria_id
  WHERE NOT EXISTS (SELECT 1 FROM listing_subcategories WHERE subcategory_name = 'Sillas' AND category_id = categoria_id);
  
  INSERT INTO listing_subcategories (subcategory_id, subcategory_name, category_id)
  SELECT gen_random_uuid(), 'Camas y colchones', categoria_id
  WHERE NOT EXISTS (SELECT 1 FROM listing_subcategories WHERE subcategory_name = 'Camas y colchones' AND category_id = categoria_id);
  
  INSERT INTO listing_subcategories (subcategory_id, subcategory_name, category_id)
  SELECT gen_random_uuid(), 'Armarios y closets', categoria_id
  WHERE NOT EXISTS (SELECT 1 FROM listing_subcategories WHERE subcategory_name = 'Armarios y closets' AND category_id = categoria_id);
  
  INSERT INTO listing_subcategories (subcategory_id, subcategory_name, category_id)
  SELECT gen_random_uuid(), 'Estanterías y libreros', categoria_id
  WHERE NOT EXISTS (SELECT 1 FROM listing_subcategories WHERE subcategory_name = 'Estanterías y libreros' AND category_id = categoria_id);
  
  INSERT INTO listing_subcategories (subcategory_id, subcategory_name, category_id)
  SELECT gen_random_uuid(), 'Decoración de pared', categoria_id
  WHERE NOT EXISTS (SELECT 1 FROM listing_subcategories WHERE subcategory_name = 'Decoración de pared' AND category_id = categoria_id);
  
  INSERT INTO listing_subcategories (subcategory_id, subcategory_name, category_id)
  SELECT gen_random_uuid(), 'Lámparas e iluminación', categoria_id
  WHERE NOT EXISTS (SELECT 1 FROM listing_subcategories WHERE subcategory_name = 'Lámparas e iluminación' AND category_id = categoria_id);
  
  INSERT INTO listing_subcategories (subcategory_id, subcategory_name, category_id)
  SELECT gen_random_uuid(), 'Cortinas y persianas', categoria_id
  WHERE NOT EXISTS (SELECT 1 FROM listing_subcategories WHERE subcategory_name = 'Cortinas y persianas' AND category_id = categoria_id);
  
  INSERT INTO listing_subcategories (subcategory_id, subcategory_name, category_id)
  SELECT gen_random_uuid(), 'Alfombras y tapetes', categoria_id
  WHERE NOT EXISTS (SELECT 1 FROM listing_subcategories WHERE subcategory_name = 'Alfombras y tapetes' AND category_id = categoria_id);
  
  INSERT INTO listing_subcategories (subcategory_id, subcategory_name, category_id)
  SELECT gen_random_uuid(), 'Cojines y almohadas decorativas', categoria_id
  WHERE NOT EXISTS (SELECT 1 FROM listing_subcategories WHERE subcategory_name = 'Cojines y almohadas decorativas' AND category_id = categoria_id);
  
  INSERT INTO listing_subcategories (subcategory_id, subcategory_name, category_id)
  SELECT gen_random_uuid(), 'Espejos', categoria_id
  WHERE NOT EXISTS (SELECT 1 FROM listing_subcategories WHERE subcategory_name = 'Espejos' AND category_id = categoria_id);
  
  INSERT INTO listing_subcategories (subcategory_id, subcategory_name, category_id)
  SELECT gen_random_uuid(), 'Plantas y macetas', categoria_id
  WHERE NOT EXISTS (SELECT 1 FROM listing_subcategories WHERE subcategory_name = 'Plantas y macetas' AND category_id = categoria_id);
  
  INSERT INTO listing_subcategories (subcategory_id, subcategory_name, category_id)
  SELECT gen_random_uuid(), 'Cuadros y arte', categoria_id
  WHERE NOT EXISTS (SELECT 1 FROM listing_subcategories WHERE subcategory_name = 'Cuadros y arte' AND category_id = categoria_id);
  
  INSERT INTO listing_subcategories (subcategory_id, subcategory_name, category_id)
  SELECT gen_random_uuid(), 'Velas y portavelas', categoria_id
  WHERE NOT EXISTS (SELECT 1 FROM listing_subcategories WHERE subcategory_name = 'Velas y portavelas' AND category_id = categoria_id);
  
  INSERT INTO listing_subcategories (subcategory_id, subcategory_name, category_id)
  SELECT gen_random_uuid(), 'Objetos decorativos', categoria_id
  WHERE NOT EXISTS (SELECT 1 FROM listing_subcategories WHERE subcategory_name = 'Objetos decorativos' AND category_id = categoria_id);
  
  INSERT INTO listing_subcategories (subcategory_id, subcategory_name, category_id)
  SELECT gen_random_uuid(), 'Vajilla y cristalería', categoria_id
  WHERE NOT EXISTS (SELECT 1 FROM listing_subcategories WHERE subcategory_name = 'Vajilla y cristalería' AND category_id = categoria_id);
  
  INSERT INTO listing_subcategories (subcategory_id, subcategory_name, category_id)
  SELECT gen_random_uuid(), 'Utensilios de cocina', categoria_id
  WHERE NOT EXISTS (SELECT 1 FROM listing_subcategories WHERE subcategory_name = 'Utensilios de cocina' AND category_id = categoria_id);
  
  INSERT INTO listing_subcategories (subcategory_id, subcategory_name, category_id)
  SELECT gen_random_uuid(), 'Electrodomésticos pequeños', categoria_id
  WHERE NOT EXISTS (SELECT 1 FROM listing_subcategories WHERE subcategory_name = 'Electrodomésticos pequeños' AND category_id = categoria_id);
  
  INSERT INTO listing_subcategories (subcategory_id, subcategory_name, category_id)
  SELECT gen_random_uuid(), 'Textiles para el hogar', categoria_id
  WHERE NOT EXISTS (SELECT 1 FROM listing_subcategories WHERE subcategory_name = 'Textiles para el hogar' AND category_id = categoria_id);
  
  INSERT INTO listing_subcategories (subcategory_id, subcategory_name, category_id)
  SELECT gen_random_uuid(), 'Organizadores y almacenamiento', categoria_id
  WHERE NOT EXISTS (SELECT 1 FROM listing_subcategories WHERE subcategory_name = 'Organizadores y almacenamiento' AND category_id = categoria_id);
END $$;

