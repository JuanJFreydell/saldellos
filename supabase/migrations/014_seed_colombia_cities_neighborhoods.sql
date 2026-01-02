-- Seed Colombia, cities (Medellin, Bogota), and neighborhoods

-- 1. Insert Colombia if it doesn't exist
INSERT INTO countries (country_id, country_name)
SELECT gen_random_uuid(), 'Colombia'
WHERE NOT EXISTS (SELECT 1 FROM countries WHERE country_name = 'Colombia');

-- 2. Insert Medellin if it doesn't exist
INSERT INTO listing_cities (city_id, city_name, country_id)
SELECT gen_random_uuid(), 'Medellín', (SELECT country_id FROM countries WHERE country_name = 'Colombia' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM listing_cities WHERE city_name = 'Medellín');

-- 3. Insert Bogota if it doesn't exist
INSERT INTO listing_cities (city_id, city_name, country_id)
SELECT gen_random_uuid(), 'Bogotá', (SELECT country_id FROM countries WHERE country_name = 'Colombia' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM listing_cities WHERE city_name = 'Bogotá');

-- 4. Insert neighborhoods for Medellin
DO $$
DECLARE
  medellin_city_id UUID;
  medellin_city_id_text TEXT;
BEGIN
  SELECT city_id INTO medellin_city_id FROM listing_cities WHERE city_name = 'Medellín' LIMIT 1;
  medellin_city_id_text := medellin_city_id::TEXT;
  
  INSERT INTO listing_neighborhoods (neighborhood_id, neighborhood_name, city_id)
  SELECT gen_random_uuid(), 'El Poblado', medellin_city_id_text
  WHERE NOT EXISTS (SELECT 1 FROM listing_neighborhoods WHERE neighborhood_name = 'El Poblado' AND city_id = medellin_city_id_text);
  
  INSERT INTO listing_neighborhoods (neighborhood_id, neighborhood_name, city_id)
  SELECT gen_random_uuid(), 'Laureles', medellin_city_id_text
  WHERE NOT EXISTS (SELECT 1 FROM listing_neighborhoods WHERE neighborhood_name = 'Laureles' AND city_id = medellin_city_id_text);
  
  INSERT INTO listing_neighborhoods (neighborhood_id, neighborhood_name, city_id)
  SELECT gen_random_uuid(), 'Envigado', medellin_city_id_text
  WHERE NOT EXISTS (SELECT 1 FROM listing_neighborhoods WHERE neighborhood_name = 'Envigado' AND city_id = medellin_city_id_text);
  
  INSERT INTO listing_neighborhoods (neighborhood_id, neighborhood_name, city_id)
  SELECT gen_random_uuid(), 'Sabaneta', medellin_city_id_text
  WHERE NOT EXISTS (SELECT 1 FROM listing_neighborhoods WHERE neighborhood_name = 'Sabaneta' AND city_id = medellin_city_id_text);
  
  INSERT INTO listing_neighborhoods (neighborhood_id, neighborhood_name, city_id)
  SELECT gen_random_uuid(), 'Belén', medellin_city_id_text
  WHERE NOT EXISTS (SELECT 1 FROM listing_neighborhoods WHERE neighborhood_name = 'Belén' AND city_id = medellin_city_id_text);
END $$;

-- 5. Insert neighborhoods for Bogota
DO $$
DECLARE
  bogota_city_id UUID;
  bogota_city_id_text TEXT;
BEGIN
  SELECT city_id INTO bogota_city_id FROM listing_cities WHERE city_name = 'Bogotá' LIMIT 1;
  bogota_city_id_text := bogota_city_id::TEXT;
  
  INSERT INTO listing_neighborhoods (neighborhood_id, neighborhood_name, city_id)
  SELECT gen_random_uuid(), 'Chapinero', bogota_city_id_text
  WHERE NOT EXISTS (SELECT 1 FROM listing_neighborhoods WHERE neighborhood_name = 'Chapinero' AND city_id = bogota_city_id_text);
  
  INSERT INTO listing_neighborhoods (neighborhood_id, neighborhood_name, city_id)
  SELECT gen_random_uuid(), 'Usaquén', bogota_city_id_text
  WHERE NOT EXISTS (SELECT 1 FROM listing_neighborhoods WHERE neighborhood_name = 'Usaquén' AND city_id = bogota_city_id_text);
  
  INSERT INTO listing_neighborhoods (neighborhood_id, neighborhood_name, city_id)
  SELECT gen_random_uuid(), 'Teusaquillo', bogota_city_id_text
  WHERE NOT EXISTS (SELECT 1 FROM listing_neighborhoods WHERE neighborhood_name = 'Teusaquillo' AND city_id = bogota_city_id_text);
  
  INSERT INTO listing_neighborhoods (neighborhood_id, neighborhood_name, city_id)
  SELECT gen_random_uuid(), 'La Candelaria', bogota_city_id_text
  WHERE NOT EXISTS (SELECT 1 FROM listing_neighborhoods WHERE neighborhood_name = 'La Candelaria' AND city_id = bogota_city_id_text);
  
  INSERT INTO listing_neighborhoods (neighborhood_id, neighborhood_name, city_id)
  SELECT gen_random_uuid(), 'Zona Rosa', bogota_city_id_text
  WHERE NOT EXISTS (SELECT 1 FROM listing_neighborhoods WHERE neighborhood_name = 'Zona Rosa' AND city_id = bogota_city_id_text);
END $$;

