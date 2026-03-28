'use client';

import { useState } from 'react';
import { Plus, X, ChevronDown, Check, AlertTriangle } from 'lucide-react';
import { demoMenuItems, demoCategories, MenuItem } from '@/lib/demoData';

const allergenLabels: Record<string, string> = {
  gluten: 'Gluten',
  lactosa: 'Lactosa',
  frutos_secos: 'Frutos secos',
  marisco: 'Marisco',
  huevo: 'Huevo',
  soja: 'Soja',
  pescado: 'Pescado',
  sulfitos: 'Sulfitos',
};

const allergenColors: Record<string, string> = {
  gluten: 'bg-amber-500/20 text-amber-400',
  lactosa: 'bg-blue-500/20 text-blue-400',
  frutos_secos: 'bg-orange-500/20 text-orange-400',
  marisco: 'bg-red-500/20 text-red-400',
  huevo: 'bg-yellow-500/20 text-yellow-400',
  soja: 'bg-green-500/20 text-green-400',
  pescado: 'bg-cyan-500/20 text-cyan-400',
  sulfitos: 'bg-purple-500/20 text-purple-400',
};

const emptyItem: Omit<MenuItem, 'id' | 'restaurant_id' | 'created_at'> = {
  category_id: 'cat-entrantes',
  name: '',
  description: '',
  price: 0,
  image_url: null,
  ingredients: [],
  allergens: [],
  is_available: true,
  is_daily_special: false,
  pairing_suggestion: '',
  chef_note: '',
  sort_order: 0,
};

export default function MenuPage() {
  const [items, setItems] = useState<MenuItem[]>(demoMenuItems);
  const [activeCategory, setActiveCategory] = useState('cat-entrantes');
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [formData, setFormData] = useState(emptyItem);
  const [ingredientsText, setIngredientsText] = useState('');
  const [toast, setToast] = useState('');

  const filteredItems = items.filter((item) => item.category_id === activeCategory);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  };

  const openAddModal = () => {
    setEditingItem(null);
    setFormData({ ...emptyItem, category_id: activeCategory });
    setIngredientsText('');
    setShowModal(true);
  };

  const openEditModal = (item: MenuItem) => {
    setEditingItem(item);
    setFormData({
      category_id: item.category_id,
      name: item.name,
      description: item.description || '',
      price: item.price,
      image_url: item.image_url,
      ingredients: item.ingredients,
      allergens: item.allergens,
      is_available: item.is_available,
      is_daily_special: item.is_daily_special,
      pairing_suggestion: item.pairing_suggestion || '',
      chef_note: item.chef_note || '',
      sort_order: item.sort_order,
    });
    setIngredientsText(item.ingredients.join(', '));
    setShowModal(true);
  };

  const handleSave = () => {
    const ingredients = ingredientsText.split(',').map((s) => s.trim()).filter(Boolean);

    if (editingItem) {
      setItems((prev) =>
        prev.map((item) =>
          item.id === editingItem.id
            ? { ...item, ...formData, ingredients }
            : item
        )
      );
      showToast('Plato actualizado');
    } else {
      const newItem: MenuItem = {
        ...formData,
        id: `item-${Date.now()}`,
        restaurant_id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
        ingredients,
        created_at: new Date().toISOString(),
      };
      setItems((prev) => [...prev, newItem]);
      showToast('Plato añadido');
    }
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    showToast('Plato eliminado');
  };

  const toggleAvailability = (id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, is_available: !item.is_available } : item
      )
    );
  };

  const toggleAllergen = (allergen: string) => {
    setFormData((prev) => ({
      ...prev,
      allergens: prev.allergens.includes(allergen)
        ? prev.allergens.filter((a) => a !== allergen)
        : [...prev.allergens, allergen],
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Gestión del Menú</h1>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 bg-[#E94560] hover:bg-[#E94560]/90 text-white font-medium px-4 py-2 rounded-lg text-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          Añadir Plato
        </button>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {demoCategories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors
              ${activeCategory === cat.id
                ? 'bg-[#E94560] text-white'
                : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
              }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Menu Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className={`bg-[#1a1a2e] border rounded-xl p-5 transition-all cursor-pointer hover:border-white/20
              ${item.is_available ? 'border-white/10' : 'border-white/5 opacity-60'}`}
            onClick={() => openEditModal(item)}
          >
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-white font-semibold text-sm">{item.name}</h3>
              <span className="text-[#E94560] font-bold text-lg">{item.price.toFixed(2)} EUR</span>
            </div>
            <p className="text-gray-400 text-xs mb-3 line-clamp-2">{item.description}</p>

            {/* Allergen badges */}
            {item.allergens.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {item.allergens.map((allergen) => (
                  <span
                    key={allergen}
                    className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${allergenColors[allergen] || 'bg-gray-500/20 text-gray-400'}`}
                  >
                    {allergenLabels[allergen] || allergen}
                  </span>
                ))}
              </div>
            )}

            {/* Availability toggle */}
            <div className="flex items-center justify-between pt-2 border-t border-white/5">
              <span className="text-xs text-gray-500">
                {item.is_available ? 'Disponible' : 'No disponible'}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleAvailability(item.id);
                }}
                className={`w-10 h-5 rounded-full transition-colors relative
                  ${item.is_available ? 'bg-green-500' : 'bg-gray-600'}`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-transform
                    ${item.is_available ? 'translate-x-5' : 'translate-x-0.5'}`}
                />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No hay platos en esta categoría</p>
          <button
            onClick={openAddModal}
            className="mt-3 text-[#E94560] text-sm font-medium hover:underline"
          >
            Añadir el primero
          </button>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 bg-green-500/20 border border-green-500/30 text-green-400 px-4 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 z-50 animate-fade-in">
          <Check className="w-4 h-4" />
          {toast}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-[#1a1a2e] border border-white/10 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-white/10 sticky top-0 bg-[#1a1a2e] rounded-t-2xl">
              <h3 className="text-lg font-semibold text-white">
                {editingItem ? 'Editar Plato' : 'Añadir Plato'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm text-gray-400 mb-1">Nombre</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-[#0a0a0f] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#E94560]/50"
                  placeholder="Nombre del plato"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm text-gray-400 mb-1">Descripción</label>
                <textarea
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-[#0a0a0f] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#E94560]/50 resize-none h-20"
                  placeholder="Descripción del plato"
                />
              </div>

              {/* Price + Category */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Precio (EUR)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-[#0a0a0f] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#E94560]/50"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Categoría</label>
                  <div className="relative">
                    <select
                      value={formData.category_id || ''}
                      onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                      className="w-full bg-[#0a0a0f] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#E94560]/50 appearance-none"
                    >
                      {demoCategories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Ingredients */}
              <div>
                <label className="block text-sm text-gray-400 mb-1">Ingredientes (separados por comas)</label>
                <input
                  type="text"
                  value={ingredientsText}
                  onChange={(e) => setIngredientsText(e.target.value)}
                  className="w-full bg-[#0a0a0f] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#E94560]/50"
                  placeholder="tomate, cebolla, ajo"
                />
              </div>

              {/* Allergens */}
              <div>
                <label className="block text-sm text-gray-400 mb-1">Alérgenos</label>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(allergenLabels).map(([key, label]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => toggleAllergen(key)}
                      className={`text-xs px-3 py-1.5 rounded-full border transition-colors
                        ${formData.allergens.includes(key)
                          ? 'bg-[#E94560]/20 border-[#E94560]/50 text-[#E94560]'
                          : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'
                        }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Pairing suggestion */}
              <div>
                <label className="block text-sm text-gray-400 mb-1">Sugerencia de maridaje</label>
                <input
                  type="text"
                  value={formData.pairing_suggestion || ''}
                  onChange={(e) => setFormData({ ...formData, pairing_suggestion: e.target.value })}
                  className="w-full bg-[#0a0a0f] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#E94560]/50"
                  placeholder="Marida bien con..."
                />
              </div>

              {/* Chef note */}
              <div>
                <label className="block text-sm text-gray-400 mb-1">Nota del chef</label>
                <input
                  type="text"
                  value={formData.chef_note || ''}
                  onChange={(e) => setFormData({ ...formData, chef_note: e.target.value })}
                  className="w-full bg-[#0a0a0f] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#E94560]/50"
                  placeholder="Nota especial del chef"
                />
              </div>

              {/* Availability toggle */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Disponible</span>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, is_available: !formData.is_available })}
                  className={`w-10 h-5 rounded-full transition-colors relative
                    ${formData.is_available ? 'bg-green-500' : 'bg-gray-600'}`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-transform
                      ${formData.is_available ? 'translate-x-5' : 'translate-x-0.5'}`}
                  />
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between p-5 border-t border-white/10">
              {editingItem && (
                <button
                  onClick={() => {
                    handleDelete(editingItem.id);
                    setShowModal(false);
                  }}
                  className="flex items-center gap-1 text-red-400 hover:text-red-300 text-sm transition-colors"
                >
                  <AlertTriangle className="w-4 h-4" />
                  Eliminar
                </button>
              )}
              <div className={`flex gap-3 ${editingItem ? '' : 'ml-auto'}`}>
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSave}
                  disabled={!formData.name || !formData.price}
                  className="px-4 py-2 bg-[#E94560] hover:bg-[#E94560]/90 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {editingItem ? 'Guardar cambios' : 'Añadir plato'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
