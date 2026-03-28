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

export type Allergen =
  | 'gluten'
  | 'lactosa'
  | 'frutos_secos'
  | 'marisco'
  | 'huevo'
  | 'soja'
  | 'pescado'
  | 'apio'
  | 'mostaza'
  | 'sesamo'
  | 'sulfitos'
  | 'moluscos';
