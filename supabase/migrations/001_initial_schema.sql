-- 001_initial_schema.sql

-- Extensiones
create extension if not exists "uuid-ossp";

-- RESTAURANTES
create table restaurants (
  id uuid primary key default uuid_generate_v4(),
  owner_id uuid references auth.users(id) on delete cascade,
  name text not null,
  slug text unique not null,
  description text,
  logo_url text,
  bot_name text default 'Roys',
  bot_tone text default 'friendly',
  bot_language text default 'es',
  primary_color text default '#E94560',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- CATEGORIAS DEL MENU
create table menu_categories (
  id uuid primary key default uuid_generate_v4(),
  restaurant_id uuid references restaurants(id) on delete cascade,
  name text not null,
  sort_order int default 0,
  is_active boolean default true
);

-- PLATOS
create table menu_items (
  id uuid primary key default uuid_generate_v4(),
  restaurant_id uuid references restaurants(id) on delete cascade,
  category_id uuid references menu_categories(id) on delete set null,
  name text not null,
  description text,
  price decimal(10,2) not null,
  image_url text,
  ingredients text[],
  allergens text[],
  is_available boolean default true,
  is_daily_special boolean default false,
  pairing_suggestion text,
  chef_note text,
  sort_order int default 0,
  created_at timestamptz default now()
);

-- MESAS
create table tables (
  id uuid primary key default uuid_generate_v4(),
  restaurant_id uuid references restaurants(id) on delete cascade,
  table_number int not null,
  qr_code_url text,
  is_active boolean default true,
  current_session_id uuid,
  unique(restaurant_id, table_number)
);

-- SESIONES DE MESA
create table table_sessions (
  id uuid primary key default uuid_generate_v4(),
  table_id uuid references tables(id) on delete cascade,
  restaurant_id uuid references restaurants(id) on delete cascade,
  status text default 'active',
  started_at timestamptz default now(),
  closed_at timestamptz
);

-- PEDIDOS
create table orders (
  id uuid primary key default uuid_generate_v4(),
  session_id uuid references table_sessions(id) on delete cascade,
  restaurant_id uuid references restaurants(id) on delete cascade,
  table_id uuid references tables(id),
  status text default 'pending',
  total decimal(10,2) default 0,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ITEMS DEL PEDIDO
create table order_items (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid references orders(id) on delete cascade,
  menu_item_id uuid references menu_items(id),
  item_name text not null,
  item_price decimal(10,2) not null,
  quantity int default 1,
  notes text
);

-- MENSAJES DE CONVERSACION
create table conversation_messages (
  id uuid primary key default uuid_generate_v4(),
  session_id uuid references table_sessions(id) on delete cascade,
  role text not null,
  content text not null,
  message_type text default 'text',
  created_at timestamptz default now()
);

-- RLS
alter table restaurants enable row level security;
alter table menu_categories enable row level security;
alter table menu_items enable row level security;
alter table tables enable row level security;
alter table table_sessions enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
alter table conversation_messages enable row level security;

-- Politicas: owner CRUD su restaurante
create policy "owners_crud_restaurant" on restaurants
  for all using (auth.uid() = owner_id);

create policy "owners_crud_categories" on menu_categories
  for all using (restaurant_id in (select id from restaurants where owner_id = auth.uid()));

create policy "owners_crud_items" on menu_items
  for all using (restaurant_id in (select id from restaurants where owner_id = auth.uid()));

create policy "owners_crud_tables" on tables
  for all using (restaurant_id in (select id from restaurants where owner_id = auth.uid()));

-- Politicas publicas
create policy "public_read_menu_categories" on menu_categories
  for select using (true);

create policy "public_read_menu_items" on menu_items
  for select using (true);

create policy "public_read_tables" on tables
  for select using (true);

create policy "public_read_restaurants" on restaurants
  for select using (true);

create policy "public_crud_sessions" on table_sessions
  for all using (true);

create policy "public_crud_orders" on orders
  for all using (true);

create policy "public_crud_order_items" on order_items
  for all using (true);

create policy "public_crud_messages" on conversation_messages
  for all using (true);
