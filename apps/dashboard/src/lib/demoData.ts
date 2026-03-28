export interface Restaurant {
  id: string;
  owner_id: string;
  name: string;
  slug: string;
  description: string | null;
  logo_url: string | null;
  bot_name: string;
  bot_tone: 'friendly' | 'formal' | 'playful';
  bot_language: string;
  primary_color: string;
  created_at: string;
  updated_at: string;
}

export interface MenuCategory {
  id: string;
  restaurant_id: string;
  name: string;
  sort_order: number;
  is_active: boolean;
}

export interface MenuItem {
  id: string;
  restaurant_id: string;
  category_id: string | null;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  ingredients: string[];
  allergens: string[];
  is_available: boolean;
  is_daily_special: boolean;
  pairing_suggestion: string | null;
  chef_note: string | null;
  sort_order: number;
  created_at: string;
}

export const demoRestaurant: Restaurant = {
  id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  owner_id: '',
  name: 'La Brasería del Centro',
  slug: 'la-braseria-del-centro',
  description: 'Restaurante de cocina tradicional española con un toque moderno.',
  logo_url: null,
  bot_name: 'Lucía',
  bot_tone: 'friendly',
  bot_language: 'es',
  primary_color: '#E94560',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export const demoCategories: MenuCategory[] = [
  { id: 'cat-entrantes', restaurant_id: demoRestaurant.id, name: 'Entrantes', sort_order: 1, is_active: true },
  { id: 'cat-principales', restaurant_id: demoRestaurant.id, name: 'Principales', sort_order: 2, is_active: true },
  { id: 'cat-postres', restaurant_id: demoRestaurant.id, name: 'Postres', sort_order: 3, is_active: true },
  { id: 'cat-bebidas', restaurant_id: demoRestaurant.id, name: 'Bebidas', sort_order: 4, is_active: true },
];

export const demoMenuItems: MenuItem[] = [
  // Entrantes
  {
    id: 'item-001', restaurant_id: demoRestaurant.id, category_id: 'cat-entrantes',
    name: 'Croquetas de jamón ibérico', description: 'Cremosas croquetas caseras de jamón ibérico de bellota',
    price: 8.50, image_url: null, ingredients: ['bechamel', 'jamón ibérico', 'cebolla', 'nuez moscada'],
    allergens: ['gluten', 'lactosa'], is_available: true, is_daily_special: false,
    pairing_suggestion: 'Perfectas con una cerveza artesana bien fría',
    chef_note: 'Receta de la abuela, con jamón de Guijuelo', sort_order: 1, created_at: '',
  },
  {
    id: 'item-002', restaurant_id: demoRestaurant.id, category_id: 'cat-entrantes',
    name: 'Ensalada César', description: 'Lechuga romana, pollo a la plancha, parmesano, croutons y salsa César casera',
    price: 9.00, image_url: null, ingredients: ['lechuga romana', 'pollo', 'parmesano', 'croutons', 'salsa César'],
    allergens: ['gluten', 'lactosa', 'huevo'], is_available: true, is_daily_special: false,
    pairing_suggestion: 'Ligera y fresca, ideal para empezar', chef_note: null, sort_order: 2, created_at: '',
  },
  {
    id: 'item-003', restaurant_id: demoRestaurant.id, category_id: 'cat-entrantes',
    name: 'Gazpacho andaluz', description: 'Gazpacho tradicional andaluz con guarnición de verduras picadas',
    price: 7.00, image_url: null, ingredients: ['tomate', 'pimiento', 'pepino', 'ajo', 'aceite de oliva'],
    allergens: [], is_available: true, is_daily_special: false,
    pairing_suggestion: 'Refrescante, ideal en los meses de calor',
    chef_note: 'Servido bien frío, con aceite de oliva virgen extra', sort_order: 3, created_at: '',
  },
  {
    id: 'item-004', restaurant_id: demoRestaurant.id, category_id: 'cat-entrantes',
    name: 'Tabla de quesos artesanos', description: 'Selección de 5 quesos artesanos españoles con membrillo y frutos secos',
    price: 14.00, image_url: null, ingredients: ['manchego', 'cabrales', 'idiazábal', 'torta del casar', 'mahón', 'membrillo', 'nueces'],
    allergens: ['lactosa', 'frutos_secos'], is_available: true, is_daily_special: false,
    pairing_suggestion: 'Marida de lujo con una copa de vino tinto Rioja',
    chef_note: 'Quesos seleccionados semanalmente de productores locales', sort_order: 4, created_at: '',
  },
  // Principales
  {
    id: 'item-005', restaurant_id: demoRestaurant.id, category_id: 'cat-principales',
    name: 'Solomillo de ternera a la brasa', description: 'Solomillo de ternera gallega madurada 30 días, cocinado a la brasa',
    price: 22.00, image_url: null, ingredients: ['solomillo de ternera', 'patatas', 'sal de escamas', 'pimienta negra'],
    allergens: [], is_available: true, is_daily_special: false,
    pairing_suggestion: 'El solomillo marida perfecto con nuestra copa de Rioja',
    chef_note: 'Carne madurada 30 días para máximo sabor', sort_order: 1, created_at: '',
  },
  {
    id: 'item-006', restaurant_id: demoRestaurant.id, category_id: 'cat-principales',
    name: 'Lubina al horno con verduras', description: 'Lubina fresca al horno con cama de verduras mediterráneas',
    price: 18.50, image_url: null, ingredients: ['lubina', 'calabacín', 'berenjena', 'tomate', 'pimiento'],
    allergens: ['pescado'], is_available: true, is_daily_special: false,
    pairing_suggestion: 'Excelente con un vino blanco Albariño',
    chef_note: 'Lubina fresca de lonja, nunca congelada', sort_order: 2, created_at: '',
  },
  {
    id: 'item-007', restaurant_id: demoRestaurant.id, category_id: 'cat-principales',
    name: 'Paella valenciana', description: 'Auténtica paella con pollo, conejo, judías verdes y garrofón',
    price: 16.00, image_url: null, ingredients: ['arroz bomba', 'pollo', 'conejo', 'judías verdes', 'garrofón', 'azafrán'],
    allergens: [], is_available: true, is_daily_special: false,
    pairing_suggestion: 'Acompáñala con una cerveza artesana',
    chef_note: 'Cocinada a fuego de leña, mínimo 2 personas', sort_order: 3, created_at: '',
  },
  {
    id: 'item-008', restaurant_id: demoRestaurant.id, category_id: 'cat-principales',
    name: 'Risotto de setas y trufa', description: 'Risotto cremoso con setas de temporada y láminas de trufa negra',
    price: 15.00, image_url: null, ingredients: ['arroz arborio', 'setas variadas', 'trufa negra', 'parmesano', 'vino blanco'],
    allergens: ['lactosa'], is_available: true, is_daily_special: false,
    pairing_suggestion: 'Sublime con una copa de vino tinto',
    chef_note: 'Trufa negra de Soria, rallada al momento en tu mesa', sort_order: 4, created_at: '',
  },
  // Postres
  {
    id: 'item-009', restaurant_id: demoRestaurant.id, category_id: 'cat-postres',
    name: 'Tarta de queso casera', description: 'Tarta de queso al horno con base de galleta y coulis de frutos rojos',
    price: 6.50, image_url: null, ingredients: ['queso crema', 'nata', 'huevos', 'galleta', 'frutos rojos'],
    allergens: ['lactosa', 'huevo', 'gluten'], is_available: true, is_daily_special: false,
    pairing_suggestion: 'Deliciosa con un café',
    chef_note: 'Horneada cada mañana, textura cremosa en el centro', sort_order: 1, created_at: '',
  },
  {
    id: 'item-010', restaurant_id: demoRestaurant.id, category_id: 'cat-postres',
    name: 'Crema catalana', description: 'Crema catalana tradicional con costra de azúcar caramelizada',
    price: 5.50, image_url: null, ingredients: ['leche', 'yemas de huevo', 'azúcar', 'canela', 'limón'],
    allergens: ['lactosa', 'huevo'], is_available: true, is_daily_special: false,
    pairing_suggestion: 'El broche perfecto para tu comida',
    chef_note: 'Se carameliza al momento con soplete', sort_order: 2, created_at: '',
  },
  {
    id: 'item-011', restaurant_id: demoRestaurant.id, category_id: 'cat-postres',
    name: 'Sorbete de limón', description: 'Refrescante sorbete de limón con un toque de hierbabuena',
    price: 4.50, image_url: null, ingredients: ['limón', 'azúcar', 'hierbabuena'],
    allergens: [], is_available: true, is_daily_special: false,
    pairing_suggestion: 'Ideal para limpiar el paladar', chef_note: null, sort_order: 3, created_at: '',
  },
  // Bebidas
  {
    id: 'item-012', restaurant_id: demoRestaurant.id, category_id: 'cat-bebidas',
    name: 'Agua mineral', description: 'Agua mineral natural 50cl', price: 2.50,
    image_url: null, ingredients: ['agua mineral'], allergens: [], is_available: true, is_daily_special: false,
    pairing_suggestion: null, chef_note: null, sort_order: 1, created_at: '',
  },
  {
    id: 'item-013', restaurant_id: demoRestaurant.id, category_id: 'cat-bebidas',
    name: 'Cerveza artesana', description: 'Cerveza artesana local tipo lager', price: 4.00,
    image_url: null, ingredients: ['cebada', 'lúpulo', 'agua', 'levadura'], allergens: ['gluten'],
    is_available: true, is_daily_special: false, pairing_suggestion: null,
    chef_note: 'De la cervecería local La Virgen', sort_order: 2, created_at: '',
  },
  {
    id: 'item-014', restaurant_id: demoRestaurant.id, category_id: 'cat-bebidas',
    name: 'Copa de vino tinto Rioja', description: 'Rioja Crianza, 14 meses en barrica de roble americano', price: 5.00,
    image_url: null, ingredients: ['uva tempranillo'], allergens: ['sulfitos'],
    is_available: true, is_daily_special: false, pairing_suggestion: null,
    chef_note: 'D.O.Ca. Rioja, Bodega Marqués de Cáceres', sort_order: 3, created_at: '',
  },
  {
    id: 'item-015', restaurant_id: demoRestaurant.id, category_id: 'cat-bebidas',
    name: 'Refresco', description: 'Coca-Cola, Fanta o Aquarius', price: 3.00,
    image_url: null, ingredients: [], allergens: [], is_available: true, is_daily_special: false,
    pairing_suggestion: null, chef_note: null, sort_order: 4, created_at: '',
  },
  {
    id: 'item-016', restaurant_id: demoRestaurant.id, category_id: 'cat-bebidas',
    name: 'Café', description: 'Café de especialidad, tueste medio', price: 2.00,
    image_url: null, ingredients: ['café arábica'], allergens: [], is_available: true, is_daily_special: false,
    pairing_suggestion: null, chef_note: 'Grano de origen Colombia, tostado artesanalmente', sort_order: 5, created_at: '',
  },
];

export interface DemoOrder {
  id: string;
  table_number: number;
  items: { name: string; quantity: number; price: number }[];
  total: number;
  status: 'pendiente' | 'preparando' | 'servido' | 'pagado';
  time: string;
}

export const demoOrders: DemoOrder[] = [
  {
    id: 'ord-001',
    table_number: 3,
    items: [
      { name: 'Croquetas de jamón ibérico', quantity: 2, price: 8.50 },
      { name: 'Solomillo de ternera a la brasa', quantity: 1, price: 22.00 },
      { name: 'Copa de vino tinto Rioja', quantity: 2, price: 5.00 },
    ],
    total: 49.00,
    status: 'preparando',
    time: '14:35',
  },
  {
    id: 'ord-002',
    table_number: 1,
    items: [
      { name: 'Ensalada César', quantity: 1, price: 9.00 },
      { name: 'Paella valenciana', quantity: 2, price: 16.00 },
      { name: 'Cerveza artesana', quantity: 2, price: 4.00 },
    ],
    total: 49.00,
    status: 'pendiente',
    time: '14:42',
  },
  {
    id: 'ord-003',
    table_number: 5,
    items: [
      { name: 'Gazpacho andaluz', quantity: 1, price: 7.00 },
      { name: 'Lubina al horno con verduras', quantity: 1, price: 18.50 },
      { name: 'Agua mineral', quantity: 1, price: 2.50 },
    ],
    total: 28.00,
    status: 'servido',
    time: '13:55',
  },
  {
    id: 'ord-004',
    table_number: 7,
    items: [
      { name: 'Tabla de quesos artesanos', quantity: 1, price: 14.00 },
      { name: 'Risotto de setas y trufa', quantity: 2, price: 15.00 },
      { name: 'Tarta de queso casera', quantity: 2, price: 6.50 },
      { name: 'Café', quantity: 2, price: 2.00 },
    ],
    total: 61.00,
    status: 'pagado',
    time: '12:20',
  },
  {
    id: 'ord-005',
    table_number: 2,
    items: [
      { name: 'Croquetas de jamón ibérico', quantity: 1, price: 8.50 },
      { name: 'Crema catalana', quantity: 1, price: 5.50 },
      { name: 'Refresco', quantity: 2, price: 3.00 },
    ],
    total: 20.00,
    status: 'preparando',
    time: '14:50',
  },
  {
    id: 'ord-006',
    table_number: 4,
    items: [
      { name: 'Solomillo de ternera a la brasa', quantity: 2, price: 22.00 },
      { name: 'Sorbete de limón', quantity: 2, price: 4.50 },
      { name: 'Copa de vino tinto Rioja', quantity: 1, price: 5.00 },
    ],
    total: 58.00,
    status: 'pendiente',
    time: '15:01',
  },
];

export interface DemoTable {
  id: string;
  table_number: number;
  is_active: boolean;
  current_session_id: string | null;
}

export const demoTables: DemoTable[] = [
  { id: 'tbl-1', table_number: 1, is_active: true, current_session_id: 'sess-1' },
  { id: 'tbl-2', table_number: 2, is_active: true, current_session_id: 'sess-2' },
  { id: 'tbl-3', table_number: 3, is_active: true, current_session_id: 'sess-3' },
  { id: 'tbl-4', table_number: 4, is_active: true, current_session_id: 'sess-4' },
  { id: 'tbl-5', table_number: 5, is_active: true, current_session_id: 'sess-5' },
  { id: 'tbl-6', table_number: 6, is_active: false, current_session_id: null },
  { id: 'tbl-7', table_number: 7, is_active: false, current_session_id: null },
  { id: 'tbl-8', table_number: 8, is_active: false, current_session_id: null },
];
