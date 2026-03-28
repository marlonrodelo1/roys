export const ORDER_STATUSES = ['pending', 'confirmed', 'preparing', 'served', 'paid'] as const;

export const SESSION_STATUSES = ['active', 'ordering', 'confirmed', 'closed'] as const;

export const BOT_TONES = [
  { value: 'friendly', label: 'Cercano y amigable' },
  { value: 'formal', label: 'Formal y elegante' },
  { value: 'playful', label: 'Divertido y casual' },
] as const;

export const BOT_LANGUAGES = [
  { value: 'es', label: 'Español' },
  { value: 'en', label: 'English' },
  { value: 'fr', label: 'Français' },
  { value: 'de', label: 'Deutsch' },
  { value: 'it', label: 'Italiano' },
] as const;

export const ALLERGEN_LIST = [
  'gluten', 'lactosa', 'frutos_secos', 'marisco', 'huevo',
  'soja', 'pescado', 'apio', 'mostaza', 'sesamo', 'sulfitos', 'moluscos',
] as const;

export const DEFAULT_PRIMARY_COLOR = '#E94560';
