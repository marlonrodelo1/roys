import type { MenuItem, MenuCategory, Restaurant } from '@roys/shared/types';

export interface DetectedItem {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  notes?: string;
}

export interface MockAIResponse {
  text: string;
  detectedItems?: DetectedItem[];
  action: 'greet' | 'suggest' | 'confirm_order' | 'add_item' | 'answer_question' | 'list_menu' | 'list_category';
}

interface MockAIContext {
  restaurant: Restaurant;
  categories: MenuCategory[];
  menuItems: MenuItem[];
  currentOrder: DetectedItem[];
  history: { role: 'user' | 'assistant'; content: string }[];
}

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

function fuzzyMatch(input: string, target: string): boolean {
  const normalInput = normalize(input);
  const normalTarget = normalize(target);
  if (normalTarget.includes(normalInput) || normalInput.includes(normalTarget)) return true;
  const targetWords = normalTarget.split(/\s+/);
  return targetWords.some(word => word.length > 3 && normalInput.includes(word));
}

function findMenuItem(input: string, items: MenuItem[]): MenuItem | undefined {
  const normalInput = normalize(input);
  // Exact-ish match first
  const exact = items.find(item => normalize(item.name) === normalInput);
  if (exact) return exact;
  // Fuzzy
  return items.find(item => fuzzyMatch(input, item.name));
}

function findCategory(input: string, categories: MenuCategory[]): MenuCategory | undefined {
  const normalInput = normalize(input);
  return categories.find(cat => {
    const normalCat = normalize(cat.name);
    return normalCat.includes(normalInput) || normalInput.includes(normalCat);
  });
}

function formatPrice(price: number): string {
  return `${price.toFixed(2)}€`;
}

export function processMockMessage(userMessage: string, context: MockAIContext): MockAIResponse {
  const { restaurant, categories, menuItems, currentOrder } = context;
  const botName = restaurant.bot_name || 'Roys';
  const input = normalize(userMessage);

  // Greeting patterns
  if (/^(hola|buenas|hey|buenos|buenas tardes|buenas noches|que tal|hi|hello)/.test(input)) {
    return {
      text: `¡Hola! Soy ${botName}, tu asistente de mesa en ${restaurant.name}. ¿Te gustaría ver nuestra carta o prefieres que te recomiende algo especial?`,
      action: 'greet',
    };
  }

  // Menu/carta request
  if (/(carta|menu|que tienen|que hay|que ofrecen|ver platos|que puedo pedir)/.test(input)) {
    const categoryList = categories
      .filter(c => c.is_active)
      .sort((a, b) => a.sort_order - b.sort_order)
      .map(c => {
        const count = menuItems.filter(i => i.category_id === c.id && i.is_available).length;
        return `  • ${c.name} (${count} opciones)`;
      })
      .join('\n');

    return {
      text: `¡Por supuesto! Tenemos estas categorías:\n${categoryList}\n\n¿Qué te apetece? Puedes pedirme que te cuente más sobre cualquier categoría.`,
      action: 'list_menu',
    };
  }

  // Category listing
  const matchedCategory = findCategory(input, categories);
  if (matchedCategory) {
    const items = menuItems
      .filter(i => i.category_id === matchedCategory.id && i.is_available)
      .sort((a, b) => a.sort_order - b.sort_order);

    const itemList = items
      .map(i => {
        let line = `  • ${i.name} — ${formatPrice(i.price)}`;
        if (i.description) line += `\n    ${i.description}`;
        return line;
      })
      .join('\n');

    return {
      text: `En ${matchedCategory.name} tenemos:\n${itemList}\n\n¿Algo te llama la atención?`,
      action: 'list_category',
    };
  }

  // Allergen question
  if (/(alergeno|alergico|alergica|sin gluten|sin lactosa|celiaco|intolerante|alergias)/.test(input)) {
    const mentionedItem = menuItems.find(item => {
      return normalize(input).includes(normalize(item.name).split(/\s+/)[0]);
    });

    if (mentionedItem && mentionedItem.allergens.length > 0) {
      return {
        text: `El plato "${mentionedItem.name}" contiene: ${mentionedItem.allergens.join(', ')}. ¿Te gustaría ver alternativas sin esos alérgenos?`,
        action: 'answer_question',
      };
    }

    const safeItems = menuItems
      .filter(i => i.is_available && i.allergens.length === 0)
      .map(i => `  • ${i.name} (${formatPrice(i.price)})`)
      .join('\n');

    return {
      text: `Estos platos no contienen alérgenos destacados:\n${safeItems}\n\n¿Alguno de estos te interesa?`,
      action: 'answer_question',
    };
  }

  // Recommendation request
  if (/(recomienda|sugieres|que me pides|especial|favorito|mejor plato|estrella)/.test(input)) {
    const specials = menuItems.filter(i => i.is_available && i.chef_note);
    const pick = specials[Math.floor(Math.random() * specials.length)] || menuItems[4]; // solomillo default
    return {
      text: `Te recomiendo ${pick.name} (${formatPrice(pick.price)}). ${pick.description}. ${pick.chef_note ? `Nota del chef: ${pick.chef_note}.` : ''} ${pick.pairing_suggestion ? pick.pairing_suggestion + '.' : ''} ¿Lo añado al pedido?`,
      action: 'suggest',
    };
  }

  // Finish / nothing else
  if (/(eso es todo|nada mas|ya esta|solo eso|terminamos|no gracias|listo|fin|acabar)/.test(input)) {
    if (currentOrder.length === 0) {
      return {
        text: `Parece que aún no has pedido nada. ¿Te gustaría ver la carta o que te recomiende algo?`,
        action: 'greet',
      };
    }

    const summary = currentOrder
      .map(item => `  • ${item.quantity}x ${item.name} — ${formatPrice(item.price * item.quantity)}`)
      .join('\n');
    const total = currentOrder.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return {
      text: `Perfecto, tu pedido sería:\n${summary}\n\nTotal: ${formatPrice(total)}\n\n¿Confirmo el pedido?`,
      action: 'confirm_order',
    };
  }

  // Confirm order
  if (/(confirmar|si|confirmo|adelante|perfecto|vale|ok|de acuerdo|claro|por favor)/.test(input) &&
      context.history.length > 0 &&
      context.history[context.history.length - 1]?.content.includes('Confirmo el pedido')) {
    return {
      text: `¡Pedido confirmado! Tu pedido llegará en breve. ¿Necesitas algo más?`,
      action: 'confirm_order',
    };
  }

  // Try to match a menu item
  const matchedItem = findMenuItem(userMessage, menuItems);
  if (matchedItem) {
    // Check if user specifies quantity
    const quantityMatch = input.match(/(\d+)\s*(de\s+)?/);
    const quantity = quantityMatch ? parseInt(quantityMatch[1]) : 1;

    const detected: DetectedItem = {
      menuItemId: matchedItem.id,
      name: matchedItem.name,
      price: matchedItem.price,
      quantity,
    };

    let response = `¡Buena elección! Añado ${quantity > 1 ? `${quantity}x ` : ''}${matchedItem.name} (${formatPrice(matchedItem.price)}${quantity > 1 ? ` c/u` : ''}) a tu pedido.`;

    if (matchedItem.pairing_suggestion) {
      response += ` ${matchedItem.pairing_suggestion}. ¿Te apetece?`;
    } else {
      response += ` ¿Quieres algo más?`;
    }

    return {
      text: response,
      detectedItems: [detected],
      action: 'add_item',
    };
  }

  // Default fallback
  return {
    text: `No estoy segura de haber entendido bien. ¿Te gustaría ver nuestra carta? Puedes pedirme ver las categorías, preguntar por alérgenos, o simplemente decirme qué te apetece.`,
    action: 'greet',
  };
}
