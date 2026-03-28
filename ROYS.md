# ROYS — Especificación Técnica Completa para Claude Code

## Visión General

Construir la plataforma **Roys**: un camarero IA conversacional para hostelería. El proyecto es un **monorepo** con tres aplicaciones Next.js y Supabase como backend.

---

## Arquitectura del Monorepo

```
roys/
├── package.json                  # Workspaces root
├── turbo.json                    # Turborepo config (opcional)
├── .env.local                    # Variables compartidas (SUPABASE_URL, SUPABASE_ANON_KEY)
│
├── packages/
│   └── shared/                   # Tipos, utilidades y constantes compartidas
│       ├── package.json
│       ├── types/
│       │   ├── index.ts
│       │   ├── menu.ts           # MenuItem, Category, Allergen
│       │   ├── order.ts          # Order, OrderItem, OrderStatus
│       │   ├── table.ts          # Table, QRConfig
│       │   └── restaurant.ts     # Restaurant, BotPersonality
│       └── constants/
│           └── index.ts          # Estados, roles, etc.
│
├── apps/
│   ├── landing/                  # Puerto 3000 — Web pública
│   │   ├── package.json
│   │   ├── next.config.js
│   │   ├── tailwind.config.js
│   │   └── src/
│   │       ├── app/
│   │       │   ├── layout.tsx
│   │       │   ├── page.tsx      # Landing principal
│   │       │   └── globals.css
│   │       └── components/
│   │           ├── Hero.tsx
│   │           ├── Features.tsx
│   │           ├── HowItWorks.tsx
│   │           ├── Architecture.tsx
│   │           ├── Pricing.tsx
│   │           ├── Footer.tsx
│   │           └── Navbar.tsx
│   │
│   ├── dashboard/                # Puerto 3001 — Panel del restaurante
│   │   ├── package.json
│   │   ├── next.config.js
│   │   ├── tailwind.config.js
│   │   └── src/
│   │       ├── app/
│   │       │   ├── layout.tsx
│   │       │   ├── page.tsx          # Redirect a /login o /dashboard
│   │       │   ├── login/
│   │       │   │   └── page.tsx      # Login con Supabase Auth
│   │       │   ├── register/
│   │       │   │   └── page.tsx      # Registro
│   │       │   └── dashboard/
│   │       │       ├── layout.tsx    # Sidebar + topbar
│   │       │       ├── page.tsx      # Overview / stats
│   │       │       ├── menu/
│   │       │       │   └── page.tsx  # CRUD del menú
│   │       │       ├── tables/
│   │       │       │   └── page.tsx  # Gestión de mesas + QR
│   │       │       ├── orders/
│   │       │       │   └── page.tsx  # Pedidos en tiempo real
│   │       │       ├── bot/
│   │       │       │   └── page.tsx  # Config personalidad del bot
│   │       │       └── settings/
│   │       │           └── page.tsx  # Config general + TPV
│   │       ├── components/
│   │       │   ├── Sidebar.tsx
│   │       │   ├── StatsCard.tsx
│   │       │   ├── MenuEditor.tsx
│   │       │   ├── TableGrid.tsx
│   │       │   ├── OrderList.tsx
│   │       │   └── QRGenerator.tsx
│   │       └── lib/
│   │           └── supabase.ts
│   │
│   └── waiter/                   # Puerto 3002 — Interfaz del camarero IA
│       ├── package.json
│       ├── next.config.js
│       ├── tailwind.config.js
│       └── src/
│           ├── app/
│           │   ├── layout.tsx
│           │   ├── globals.css       # Animaciones globales, fuentes
│           │   ├── page.tsx          # Redirect a /[restaurantId]/[tableId]
│           │   └── [restaurantId]/
│           │       └── [tableId]/
│           │           └── page.tsx  # Pantalla principal del camarero
│           ├── components/
│           │   ├── OrbAvatar.tsx         # Orbe animado con estados
│           │   ├── VoiceInterface.tsx    # Control de voz (STT + TTS)
│           │   ├── ChatBubbles.tsx       # Mensajes de texto mínimos
│           │   ├── OrderSummary.tsx      # Resumen visual del pedido
│           │   ├── ConfirmDialog.tsx     # Confirmación del pedido
│           │   ├── ParticleBackground.tsx # Fondo de partículas
│           │   └── WaveVisualizer.tsx    # Visualizador de audio
│           ├── hooks/
│           │   ├── useSpeechRecognition.ts  # Web Speech API STT
│           │   ├── useSpeechSynthesis.ts    # Web Speech API TTS
│           │   └── useWaiterAI.ts           # Mock del agente IA
│           └── lib/
│               ├── supabase.ts
│               └── mockAI.ts            # Respuestas mock del camarero
│
├── supabase/
│   ├── config.toml
│   └── migrations/
│       └── 001_initial_schema.sql   # Schema completo
│
└── docs/
    └── README.md
```

---

## Stack Técnico

| Capa | Tecnología |
|------|-----------|
| Frontend | Next.js 14 (App Router) + Tailwind CSS + Framer Motion |
| Backend / Auth / DB | Supabase (PostgreSQL + Auth + Realtime + Edge Functions) |
| Voz (STT) | Web Speech API (SpeechRecognition nativa del navegador) |
| Voz (TTS) | Web Speech API (SpeechSynthesis nativa del navegador) |
| IA (mock) | Respuestas simuladas en `/lib/mockAI.ts` |
| Monorepo | npm workspaces |
| Iconos | Lucide React |
| Animaciones | Framer Motion + CSS animations |

---

## Base de Datos — Supabase Schema

```sql
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
  bot_tone text default 'friendly', -- friendly, formal, playful
  bot_language text default 'es',
  primary_color text default '#E94560',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- CATEGORÍAS DEL MENÚ
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
  ingredients text[], -- array de ingredientes
  allergens text[],   -- gluten, lactosa, frutos_secos, marisco, huevo, soja, etc.
  is_available boolean default true,
  is_daily_special boolean default false,
  pairing_suggestion text, -- sugerencia de maridaje
  chef_note text, -- nota del chef
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
  current_session_id uuid, -- sesión activa
  unique(restaurant_id, table_number)
);

-- SESIONES DE MESA (una por cada vez que un cliente escanea el QR)
create table table_sessions (
  id uuid primary key default uuid_generate_v4(),
  table_id uuid references tables(id) on delete cascade,
  restaurant_id uuid references restaurants(id) on delete cascade,
  status text default 'active', -- active, ordering, confirmed, closed
  started_at timestamptz default now(),
  closed_at timestamptz
);

-- PEDIDOS
create table orders (
  id uuid primary key default uuid_generate_v4(),
  session_id uuid references table_sessions(id) on delete cascade,
  restaurant_id uuid references restaurants(id) on delete cascade,
  table_id uuid references tables(id),
  status text default 'pending', -- pending, confirmed, preparing, served, paid
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
  item_name text not null, -- snapshot del nombre
  item_price decimal(10,2) not null, -- snapshot del precio
  quantity int default 1,
  notes text -- "sin cebolla", "poco hecho", etc.
);

-- MENSAJES DE CONVERSACIÓN (historial del chat por sesión)
create table conversation_messages (
  id uuid primary key default uuid_generate_v4(),
  session_id uuid references table_sessions(id) on delete cascade,
  role text not null, -- 'user' | 'assistant'
  content text not null,
  message_type text default 'text', -- text, voice, order_summary, confirmation
  created_at timestamptz default now()
);

-- RLS (Row Level Security)
alter table restaurants enable row level security;
alter table menu_categories enable row level security;
alter table menu_items enable row level security;
alter table tables enable row level security;
alter table table_sessions enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
alter table conversation_messages enable row level security;

-- Políticas: el owner puede CRUD su restaurante
create policy "owners_crud_restaurant" on restaurants
  for all using (auth.uid() = owner_id);

create policy "owners_crud_categories" on menu_categories
  for all using (restaurant_id in (select id from restaurants where owner_id = auth.uid()));

create policy "owners_crud_items" on menu_items
  for all using (restaurant_id in (select id from restaurants where owner_id = auth.uid()));

create policy "owners_crud_tables" on tables
  for all using (restaurant_id in (select id from restaurants where owner_id = auth.uid()));

-- Políticas públicas: los clientes (sin auth) pueden leer menú y escribir pedidos
create policy "public_read_menu_categories" on menu_categories
  for select using (true);

create policy "public_read_menu_items" on menu_items
  for select using (true);

create policy "public_read_tables" on tables
  for select using (true);

create policy "public_crud_sessions" on table_sessions
  for all using (true);

create policy "public_crud_orders" on orders
  for all using (true);

create policy "public_crud_order_items" on order_items
  for all using (true);

create policy "public_crud_messages" on conversation_messages
  for all using (true);
```

---

## APP 1: Landing (Puerto 3000)

### Estética y Diseño

**Dirección creativa:** Dark futurista con acentos neón. Inspiración en interfaces de ciencia ficción (Blade Runner, Tron, Minority Report). Fondo oscuro (#0a0a0f) con gradientes de azul eléctrico y rosa/rojo (#E94560). Partículas flotantes sutiles. Tipografía de alto impacto.

**Fuentes:**
- Display: `"Orbitron"` (Google Fonts) — futurista, geométrica
- Body: `"Outfit"` (Google Fonts) — moderna, limpia, legible

**Paleta de colores:**
```
--bg-primary: #0a0a0f
--bg-secondary: #12121a
--bg-card: #1a1a2e
--accent-red: #E94560
--accent-blue: #0F3460
--accent-cyan: #00d4ff
--accent-green: #16C79A
--text-primary: #f0f0f0
--text-secondary: #8892a4
--glow-red: rgba(233, 69, 96, 0.3)
--glow-cyan: rgba(0, 212, 255, 0.3)
```

### Secciones de la Landing

1. **Navbar** — Logo "ROYS" con glow, links (Producto, Cómo Funciona, Arquitectura, Precios), botón CTA "Acceder" que lleva al dashboard (puerto 3001)

2. **Hero** — Título enorme: "El camarero IA que nunca descansa". Subtítulo: "Inteligencia artificial conversacional en cada mesa de tu restaurante. Voz, recomendaciones, pedidos automáticos al TPV." Botón CTA principal. A la derecha o debajo: mockup/animación del orbe IA con ondas de audio. Partículas de fondo animadas con CSS.

3. **Features** — Grid de 6 cards con iconos animados:
   - Conversación natural por voz
   - Venta activa inteligente
   - Integración con tu TPV
   - Control de alérgenos e ingredientes
   - Dashboard en tiempo real
   - Multi-idioma

4. **HowItWorks** — 4 pasos con ilustraciones/iconos:
   1. Escanea el QR → 2. Habla con Roys → 3. Roys sugiere y vende → 4. Pedido al TPV

5. **Architecture** — Diagrama visual (hecho con CSS/SVG) mostrando:
   - Mesas con agentes → OpenClaw → Claude API
   - Supervisor central → Dashboard
   - Flechas animadas de conexión

6. **Pricing** — 3 cards (Starter, Professional, Enterprise) con efecto glassmorphism y borde glow en el plan destacado

7. **Footer** — Links, redes, copyright

### Detalles técnicos de la Landing

- Todas las animaciones con Framer Motion: `motion.div` con `initial`, `animate`, `whileInView`
- Scroll animations con `useInView` de Framer Motion
- Efecto parallax sutil en el hero
- Partículas de fondo: canvas o divs animados con CSS `@keyframes`
- Glassmorphism en cards: `backdrop-blur-lg bg-white/5 border border-white/10`
- Glow effects: `shadow-[0_0_30px_rgba(233,69,96,0.3)]`

---

## APP 2: Dashboard (Puerto 3001)

### Estética

**Dirección:** Dark profesional. Mismo universo visual que la landing pero más sobrio. Sidebar oscura, contenido en cards con bordes sutiles. Funcional y limpio.

**Fuentes:**
- Headings: `"Outfit"` — semi-bold
- Body: `"Outfit"` — regular

### Flujo de Auth

1. `/login` — Email + password con Supabase Auth. Diseño centrado, fondo oscuro, logo arriba.
2. `/register` — Registro: nombre del restaurante, email, password. Al registrar, crear automáticamente el registro en tabla `restaurants` con el `owner_id`.
3. Middleware de Next.js que protege todas las rutas `/dashboard/*`. Si no hay sesión → redirect a `/login`.

### Pantallas del Dashboard

**Layout:** Sidebar izquierda fija (colapsable en móvil) + contenido a la derecha.

**Sidebar items:**
- 📊 Overview (dashboard principal)
- 🍽️ Menú
- 🪑 Mesas & QR
- 📋 Pedidos
- 🤖 Personalidad del Bot
- ⚙️ Configuración

**Páginas:**

#### `/dashboard` — Overview
- 4 StatsCards arriba: Pedidos hoy, Ventas hoy (€), Ticket medio, Mesas activas
- Gráfico de pedidos por hora (mock con datos estáticos, usar Recharts o similar)
- Lista de últimos 5 pedidos

#### `/dashboard/menu` — Gestión del Menú
- CRUD completo de categorías y platos
- Para cada plato: nombre, descripción, precio, categoría, ingredientes (tags), alérgenos (checkboxes), disponibilidad (toggle), sugerencia de maridaje, nota del chef
- Vista en tabla o grid de cards
- Botón "Añadir plato" abre modal/drawer
- Todo persiste en Supabase

#### `/dashboard/tables` — Mesas & QR
- Grid visual de mesas (cuadrados numerados, verde=activa, gris=inactiva)
- Botón "Añadir mesa" que crea registro y genera QR
- El QR apunta a: `http://localhost:3002/{restaurantId}/{tableNumber}`
- Botón para descargar QR como imagen (usar librería `qrcode` de npm)
- Poder activar/desactivar mesas

#### `/dashboard/orders` — Pedidos
- Lista en tiempo real de pedidos (Supabase Realtime)
- Cada pedido muestra: mesa, items, total, hora, estado
- Botones para cambiar estado: pendiente → preparando → servido → pagado
- Filtros por estado

#### `/dashboard/bot` — Personalidad del Bot
- Campo: Nombre del asistente (default: "Roys")
- Select: Tono (Cercano y amigable / Formal y elegante / Divertido y casual)
- Select: Idioma principal (Español, English, Français, Deutsch, Italiano)
- Textarea: Instrucciones especiales (ej: "Siempre recomienda el vino de la casa")
- Color primario del bot (color picker)
- Preview en vivo: un mini chat simulado que muestra cómo hablaría el bot con esa config

#### `/dashboard/settings` — Configuración
- Datos del restaurante: nombre, slug, descripción, logo
- Sección TPV: estado de conexión (mock: "No conectado"), campo para API key del TPV
- Zona de peligro: eliminar restaurante

---

## APP 3: Waiter — Interfaz del Camarero IA (Puerto 3002)

### ⚡ ESTA ES LA APP ESTRELLA — MÁXIMO ESFUERZO CREATIVO ⚡

### Estética

**Dirección creativa:** Ciencia ficción inmersiva. Pantalla completamente oscura (#050508). El usuario siente que está interactuando con una inteligencia artificial real. Nada de UI convencional. Todo es el orbe, la voz y la conversación.

**Fuentes:**
- UI: `"Orbitron"` — para labels, estados, números
- Chat: `"Outfit"` — para mensajes de texto

**Paleta:**
```
--bg: #050508
--orb-idle: radial-gradient(circle, #1a1a3e, #0a0a1a)
--orb-listening: radial-gradient(circle, #E94560, #8b1a2b)
--orb-speaking: radial-gradient(circle, #00d4ff, #0F3460)
--orb-thinking: radial-gradient(circle, #16C79A, #0a3d2e)
--text: #e0e0e0
--text-dim: #555570
--accent: #E94560
```

### Ruta dinámica

`/[restaurantId]/[tableId]` — Al entrar:
1. Fetch del restaurante y mesa desde Supabase
2. Fetch del menú completo
3. Crear una `table_session`
4. Inicializar el agente mock con el contexto del menú

### Componentes y Comportamiento

#### `ParticleBackground.tsx`
- Canvas o divs con partículas flotando lentamente
- Muy sutil, casi imperceptible, da profundidad al fondo
- Color: puntos blancos/cyan con opacidad baja

#### `OrbAvatar.tsx` — EL ELEMENTO CENTRAL
- Esfera/orbe en el centro de la pantalla
- **4 estados con transiciones fluidas (Framer Motion):**
  1. **IDLE** — Respira suavemente (scale pulse lento), gradiente azul oscuro, anillos orbitando lentamente
  2. **LISTENING** — Crece un 15%, gradiente rojo/rosa, ondas de audio alrededor, anillos giran más rápido. Muestra texto "Escuchando..."
  3. **THINKING** — Pulsación rápida, gradiente verde, partículas convergiendo hacia el centro. Muestra "Procesando..."
  4. **SPEAKING** — Gradiente cyan/azul brillante, ondas de voz emanando desde el orbe, glow intenso. Muestra el texto de respuesta

- El orbe tiene:
  - Glow externo animado (`box-shadow` con animación)
  - 2-3 anillos orbitando (borders con `rotate` animation)
  - Efecto de glass/refracción (gradientes + blur)

#### `WaveVisualizer.tsx`
- Visualizador de onda de audio circular alrededor del orbe
- Cuando el usuario habla: las ondas reaccionan (mock con animación CSS random)
- Cuando Roys habla: ondas sincronizadas (simulación de audio output)
- Implementar con SVG paths o canvas

#### `VoiceInterface.tsx` — CORE DE INTERACCIÓN
- **Botón "mantener pulsado para hablar"** grande en la parte inferior (tipo walkie-talkie):
  - Círculo con icono de micrófono
  - Al pulsar: cambia el orbe a LISTENING, activa SpeechRecognition
  - Al soltar: envía el texto reconocido al mock IA
  - El orbe pasa a THINKING y luego a SPEAKING
  - Roys responde por voz (SpeechSynthesis) Y muestra el texto

- **Hook `useSpeechRecognition.ts`:**
  ```ts
  // Usa la Web Speech API nativa
  // SpeechRecognition / webkitSpeechRecognition
  // Devuelve: { transcript, isListening, startListening, stopListening, isSupported }
  // Configurar lang según el bot_language del restaurante
  ```

- **Hook `useSpeechSynthesis.ts`:**
  ```ts
  // Usa la Web Speech API nativa
  // SpeechSynthesis
  // Devuelve: { speak, stop, isSpeaking, isSupported }
  // Seleccionar una voz en español por defecto
  // Velocidad ligeramente más lenta que default para claridad
  ```

#### `ChatBubbles.tsx`
- **Zona de texto MÍNIMA** — solo aparece cuando es necesario
- Posición: parte inferior, encima del botón de voz
- Muestra solo los últimos 2-3 mensajes en formato burbuja
- Burbujas semi-transparentes con backdrop-blur
- El texto del usuario se muestra brevemente y desaparece (fade out)
- El texto de Roys permanece mientras habla y luego se minimiza

#### `OrderSummary.tsx`
- Panel deslizante desde la derecha (o bottom sheet en móvil)
- Se muestra cuando Roys confirma items
- Lista visual de items pedidos: nombre, cantidad, precio
- Total en la parte inferior
- Botón "Confirmar pedido" con efecto glow
- Animación de cada item al añadirse (slide in + fade)

#### `ConfirmDialog.tsx`
- Modal de confirmación final
- Muestra resumen completo del pedido
- Botón "Confirmar" grande y prominente
- Al confirmar: crea el order en Supabase, muestra animación de éxito (check animado + partículas)
- Roys dice por voz: "Pedido confirmado. Tu pedido llegará en breve."

### Mock IA — `mockAI.ts`

```ts
// Sistema de respuestas mock que simula el comportamiento del agente camarero
// Recibe: mensaje del usuario + menú del restaurante + historial de conversación
// Devuelve: respuesta del camarero + items detectados para el pedido

interface MockAIResponse {
  text: string;          // Lo que dice Roys
  detectedItems?: {      // Items que Roys detecta del pedido
    menuItemId: string;
    name: string;
    quantity: number;
    notes?: string;
  }[];
  action?: 'greet' | 'suggest' | 'confirm_order' | 'add_item' | 'answer_question';
}

// Implementar con pattern matching simple:
// - Si el mensaje contiene "carta/menú/qué tienen" → listar categorías
// - Si menciona una categoría → listar platos de esa categoría
// - Si menciona un plato del menú → confirmar y preguntar si quiere algo más
// - Si pregunta por alérgenos → responder con los del plato
// - Si dice "eso es todo/nada más" → mostrar resumen del pedido
// - Si dice "confirmar/sí/adelante" → confirmar el pedido
// - Default: respuesta amable guiando hacia el menú

// El mock debe conocer el menú real del restaurante (cargado de Supabase)
// y buscar coincidencias aproximadas en los nombres de platos
```

### Hook `useWaiterAI.ts`

```ts
// Gestiona todo el flujo del agente:
// 1. Recibe el transcript de voz del usuario
// 2. Lo envía al mockAI con el contexto
// 3. Recibe la respuesta
// 4. Actualiza el historial de conversación
// 5. Actualiza el pedido en curso si hay items detectados
// 6. Guarda los mensajes en Supabase (conversation_messages)
// 7. Devuelve el texto para que VoiceInterface lo hable con TTS

// Estado que expone:
// { 
//   messages, currentOrder, orbState, 
//   sendMessage, confirmOrder, resetConversation 
// }
```

---

## Datos Seed (para desarrollo)

Crear un script `seed.ts` o inserción SQL que cargue un restaurante de ejemplo:

**Restaurante:** "La Brasería del Centro"
**Bot:** Nombre "Lucía", tono "friendly", idioma "es"

**Categorías y platos de ejemplo:**

- **Entrantes:** Croquetas de jamón ibérico (€8.50), Ensalada César (€9.00), Gazpacho andaluz (€7.00), Tabla de quesos artesanos (€14.00)
- **Principales:** Solomillo de ternera a la brasa (€22.00), Lubina al horno con verduras (€18.50), Paella valenciana (€16.00), Risotto de setas y trufa (€15.00)
- **Postres:** Tarta de queso casera (€6.50), Crema catalana (€5.50), Sorbete de limón (€4.50)
- **Bebidas:** Agua mineral (€2.50), Cerveza artesana (€4.00), Copa de vino tinto Rioja (€5.00), Refresco (€3.00), Café (€2.00)

Incluir alérgenos realistas, sugerencias de maridaje ("El solomillo marida perfecto con nuestra copa de Rioja"), y notas del chef.

**Mesas:** 8 mesas (mesa 1 a mesa 8), todas activas.

---

## Configuración de Puertos

```json
// apps/landing/next.config.js
// dev: next dev -p 3000

// apps/dashboard/next.config.js  
// dev: next dev -p 3001

// apps/waiter/next.config.js
// dev: next dev -p 3002
```

**package.json raíz (scripts):**
```json
{
  "scripts": {
    "dev": "concurrently \"npm run dev:landing\" \"npm run dev:dashboard\" \"npm run dev:waiter\"",
    "dev:landing": "cd apps/landing && next dev -p 3000",
    "dev:dashboard": "cd apps/dashboard && next dev -p 3001",
    "dev:waiter": "cd apps/waiter && next dev -p 3002",
    "build": "npm run build --workspaces",
    "seed": "node supabase/seed.js"
  }
}
```

---

## Variables de Entorno

```env
# .env.local (raíz)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxxxx

# Para el dashboard
SUPABASE_SERVICE_ROLE_KEY=xxxxx

# Dominio base (para generar QR)
NEXT_PUBLIC_WAITER_URL=http://localhost:3002
NEXT_PUBLIC_DASHBOARD_URL=http://localhost:3001
```

---

## Instrucciones de Ejecución para Claude Code

### Orden de construcción recomendado:

1. **Inicializar monorepo** — package.json raíz con workspaces, instalar dependencias
2. **Shared types** — packages/shared con los tipos TypeScript
3. **Schema Supabase** — crear la migración SQL
4. **App Waiter (3002)** — PRIORIDAD MÁXIMA. Es el core del producto. Empezar por aquí.
5. **App Landing (3000)** — La web de venta
6. **App Dashboard (3001)** — El panel de gestión

### Dependencias clave por app:

```
# Todas las apps
next react react-dom tailwindcss framer-motion lucide-react @supabase/supabase-js

# Landing adicional
# (ninguna extra)

# Dashboard adicional
qrcode recharts (o chart.js) 

# Waiter adicional
# (solo dependencias core, Web Speech API es nativa del navegador)
```

### Notas importantes:

- **Supabase:** El usuario configurará su propio proyecto Supabase. Dejar las env vars preparadas y documentar qué tablas crear.
- **Web Speech API:** Funciona en Chrome y Edge. Mostrar fallback de texto si no está soportada.
- **QR:** Cada QR codifica la URL `{WAITER_URL}/{restaurantId}/{tableNumber}`
- **Responsive:** La app waiter DEBE ser 100% mobile-first. Es lo que el cliente usa en su móvil.
- **La landing y el dashboard pueden ser desktop-first con responsive.**
- **No usar localStorage para datos importantes**, usar Supabase para todo lo persistente.
- **El mock IA debe ser lo suficientemente inteligente** para hacer demos convincentes. Pattern matching con el menú real del restaurante.

---

## Criterios de Éxito

- [ ] La landing impresiona visualmente y comunica el concepto al instante
- [ ] El registro/login funciona con Supabase Auth
- [ ] El CRUD del menú persiste en Supabase
- [ ] Las mesas generan QR funcionales que apuntan a la app waiter
- [ ] La app waiter se abre desde el QR y carga el menú del restaurante correcto
- [ ] El orbe tiene los 4 estados visuales con transiciones fluidas
- [ ] El usuario puede hablar y el speech-to-text captura el texto
- [ ] El mock IA responde coherentemente con el menú
- [ ] El text-to-speech lee la respuesta de Roys en voz alta
- [ ] El pedido se construye durante la conversación
- [ ] Al confirmar, el pedido se guarda en Supabase
- [ ] Los pedidos aparecen en tiempo real en el dashboard
