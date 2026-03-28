-- Seed data: Restaurante "La Braseria del Centro"
-- NOTA: Ejecutar despues de crear un usuario en Supabase Auth.
-- Reemplazar 'OWNER_USER_ID' con el UUID del usuario registrado.

-- Restaurante
INSERT INTO restaurants (id, owner_id, name, slug, description, bot_name, bot_tone, bot_language, primary_color)
VALUES (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  null, -- Reemplazar con owner_id real
  'La Brasería del Centro',
  'la-braseria-del-centro',
  'Restaurante de cocina tradicional española con un toque moderno. Especialistas en carnes a la brasa y productos de temporada.',
  'Lucía',
  'friendly',
  'es',
  '#E94560'
);

-- Categorias
INSERT INTO menu_categories (id, restaurant_id, name, sort_order) VALUES
  ('cat-entrantes-0001-0000-000000000000', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Entrantes', 1),
  ('cat-principal-0001-0000-000000000000', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Principales', 2),
  ('cat-postres00-0001-0000-000000000000', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Postres', 3),
  ('cat-bebidas00-0001-0000-000000000000', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Bebidas', 4);

-- Entrantes
INSERT INTO menu_items (restaurant_id, category_id, name, description, price, ingredients, allergens, pairing_suggestion, chef_note, sort_order) VALUES
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'cat-entrantes-0001-0000-000000000000',
   'Croquetas de jamón ibérico', 'Cremosas croquetas caseras de jamón ibérico de bellota', 8.50,
   ARRAY['bechamel', 'jamón ibérico', 'cebolla', 'nuez moscada'], ARRAY['gluten', 'lactosa'],
   'Perfectas con una cerveza artesana bien fría', 'Receta de la abuela, con jamón de Guijuelo', 1),

  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'cat-entrantes-0001-0000-000000000000',
   'Ensalada César', 'Lechuga romana, pollo a la plancha, parmesano, croutons y salsa César casera', 9.00,
   ARRAY['lechuga romana', 'pollo', 'parmesano', 'croutons', 'salsa César'], ARRAY['gluten', 'lactosa', 'huevo'],
   'Ligera y fresca, ideal para empezar', null, 2),

  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'cat-entrantes-0001-0000-000000000000',
   'Gazpacho andaluz', 'Gazpacho tradicional andaluz con guarnición de verduras picadas', 7.00,
   ARRAY['tomate', 'pimiento', 'pepino', 'ajo', 'aceite de oliva', 'vinagre'], ARRAY[]::text[],
   'Refrescante, ideal en los meses de calor', 'Servido bien frío, con aceite de oliva virgen extra', 3),

  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'cat-entrantes-0001-0000-000000000000',
   'Tabla de quesos artesanos', 'Selección de 5 quesos artesanos españoles con membrillo y frutos secos', 14.00,
   ARRAY['manchego', 'cabrales', 'idiazábal', 'torta del casar', 'mahón', 'membrillo', 'nueces'], ARRAY['lactosa', 'frutos_secos'],
   'Marida de lujo con una copa de vino tinto Rioja', 'Quesos seleccionados semanalmente de productores locales', 4);

-- Principales
INSERT INTO menu_items (restaurant_id, category_id, name, description, price, ingredients, allergens, pairing_suggestion, chef_note, sort_order) VALUES
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'cat-principal-0001-0000-000000000000',
   'Solomillo de ternera a la brasa', 'Solomillo de ternera gallega madurada 30 días, cocinado a la brasa con guarnición de patatas', 22.00,
   ARRAY['solomillo de ternera', 'patatas', 'sal de escamas', 'pimienta negra', 'aceite de oliva'], ARRAY[]::text[],
   'El solomillo marida perfecto con nuestra copa de Rioja', 'Carne madurada 30 días para máximo sabor', 1),

  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'cat-principal-0001-0000-000000000000',
   'Lubina al horno con verduras', 'Lubina fresca al horno con cama de verduras mediterráneas', 18.50,
   ARRAY['lubina', 'calabacín', 'berenjena', 'tomate', 'pimiento', 'aceite de oliva'], ARRAY['pescado'],
   'Excelente con un vino blanco Albariño', 'Lubina fresca de lonja, nunca congelada', 2),

  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'cat-principal-0001-0000-000000000000',
   'Paella valenciana', 'Auténtica paella con pollo, conejo, judías verdes y garrofón', 16.00,
   ARRAY['arroz bomba', 'pollo', 'conejo', 'judías verdes', 'garrofón', 'azafrán', 'tomate'], ARRAY[]::text[],
   'Acompáñala con una cerveza artesana', 'Cocinada a fuego de leña, mínimo 2 personas', 3),

  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'cat-principal-0001-0000-000000000000',
   'Risotto de setas y trufa', 'Risotto cremoso con setas de temporada y láminas de trufa negra', 15.00,
   ARRAY['arroz arborio', 'setas variadas', 'trufa negra', 'parmesano', 'cebolla', 'vino blanco', 'caldo de verduras'], ARRAY['lactosa'],
   'Sublime con una copa de vino tinto', 'Trufa negra de Soria, rallada al momento en tu mesa', 4);

-- Postres
INSERT INTO menu_items (restaurant_id, category_id, name, description, price, ingredients, allergens, pairing_suggestion, chef_note, sort_order) VALUES
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'cat-postres00-0001-0000-000000000000',
   'Tarta de queso casera', 'Tarta de queso al horno con base de galleta y coulis de frutos rojos', 6.50,
   ARRAY['queso crema', 'nata', 'huevos', 'galleta', 'mantequilla', 'frutos rojos'], ARRAY['lactosa', 'huevo', 'gluten'],
   'Deliciosa con un café', 'Horneada cada mañana, textura cremosa en el centro', 1),

  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'cat-postres00-0001-0000-000000000000',
   'Crema catalana', 'Crema catalana tradicional con costra de azúcar caramelizada', 5.50,
   ARRAY['leche', 'yemas de huevo', 'azúcar', 'canela', 'limón'], ARRAY['lactosa', 'huevo'],
   'El broche perfecto para tu comida', 'Se carameliza al momento con soplete', 2),

  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'cat-postres00-0001-0000-000000000000',
   'Sorbete de limón', 'Refrescante sorbete de limón con un toque de hierbabuena', 4.50,
   ARRAY['limón', 'azúcar', 'hierbabuena'], ARRAY[]::text[],
   'Ideal para limpiar el paladar', null, 3);

-- Bebidas
INSERT INTO menu_items (restaurant_id, category_id, name, description, price, ingredients, allergens, pairing_suggestion, chef_note, sort_order) VALUES
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'cat-bebidas00-0001-0000-000000000000',
   'Agua mineral', 'Agua mineral natural 50cl', 2.50,
   ARRAY['agua mineral'], ARRAY[]::text[], null, null, 1),

  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'cat-bebidas00-0001-0000-000000000000',
   'Cerveza artesana', 'Cerveza artesana local tipo lager', 4.00,
   ARRAY['cebada', 'lúpulo', 'agua', 'levadura'], ARRAY['gluten'],
   null, 'De la cervecería local La Virgen', 2),

  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'cat-bebidas00-0001-0000-000000000000',
   'Copa de vino tinto Rioja', 'Rioja Crianza, 14 meses en barrica de roble americano', 5.00,
   ARRAY['uva tempranillo'], ARRAY['sulfitos'],
   null, 'D.O.Ca. Rioja, Bodega Marqués de Cáceres', 3),

  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'cat-bebidas00-0001-0000-000000000000',
   'Refresco', 'Coca-Cola, Fanta o Aquarius', 3.00,
   ARRAY[]::text[], ARRAY[]::text[], null, null, 4),

  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'cat-bebidas00-0001-0000-000000000000',
   'Café', 'Café de especialidad, tueste medio', 2.00,
   ARRAY['café arábica'], ARRAY[]::text[],
   null, 'Grano de origen Colombia, tostado artesanalmente', 5);

-- 8 Mesas
INSERT INTO tables (restaurant_id, table_number, is_active) VALUES
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 1, true),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 2, true),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 3, true),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 4, true),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 5, true),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 6, true),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 7, true),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 8, true);
