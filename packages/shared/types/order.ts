export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'served' | 'paid';

export interface Order {
  id: string;
  session_id: string;
  restaurant_id: string;
  table_id: string;
  status: OrderStatus;
  total: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  menu_item_id: string;
  item_name: string;
  item_price: number;
  quantity: number;
  notes: string | null;
}

export interface OrderWithItems extends Order {
  order_items: OrderItem[];
}
