import WaiterScreen from './WaiterScreen';
import { demoRestaurant, demoCategories, demoMenuItems } from '../../../lib/demoData';
import { supabase } from '../../../lib/supabase';

interface PageProps {
  params: { restaurantId: string; tableId: string };
}

export default async function WaiterPage({ params }: PageProps) {
  const { restaurantId, tableId } = params;

  let restaurant = demoRestaurant;
  let categories = demoCategories;
  let menuItems = demoMenuItems;
  let tableNumber = parseInt(tableId) || 1;

  // Try to load from Supabase if configured
  if (supabase) {
    try {
      const { data: rest } = await supabase
        .from('restaurants')
        .select('*')
        .eq('id', restaurantId)
        .single();

      if (rest) {
        restaurant = rest;

        const [catRes, itemRes] = await Promise.all([
          supabase.from('menu_categories').select('*').eq('restaurant_id', restaurantId).order('sort_order'),
          supabase.from('menu_items').select('*').eq('restaurant_id', restaurantId).eq('is_available', true).order('sort_order'),
        ]);

        if (catRes.data) categories = catRes.data;
        if (itemRes.data) menuItems = itemRes.data;
      }
    } catch {
      // Fall back to demo data
    }
  }

  return (
    <WaiterScreen
      restaurant={restaurant}
      categories={categories}
      menuItems={menuItems}
      tableNumber={tableNumber}
    />
  );
}
