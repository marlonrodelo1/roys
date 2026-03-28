'use client';

import { useState } from 'react';
import { Settings, Save, Check, AlertTriangle, Plug, Trash2, Store } from 'lucide-react';
import { demoRestaurant } from '@/lib/demoData';

export default function SettingsPage() {
  const [restaurant, setRestaurant] = useState({
    name: demoRestaurant.name,
    slug: demoRestaurant.slug,
    description: demoRestaurant.description || '',
  });
  const [apiKey, setApiKey] = useState('');
  const [toast, setToast] = useState('');

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  };

  const handleSave = () => {
    showToast('Configuración guardada');
  };

  const handleDelete = () => {
    if (typeof window !== 'undefined') {
      const confirmed = window.confirm(
        '¿Estás seguro de que quieres eliminar este restaurante? Esta acción no se puede deshacer.'
      );
      if (confirmed) {
        showToast('Restaurante eliminado (demo)');
      }
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-2xl font-bold text-white flex items-center gap-2">
        <Settings className="w-6 h-6 text-gray-400" />
        Configuración
      </h1>

      {/* Restaurant Data */}
      <div className="bg-[#1a1a2e] border border-white/10 rounded-xl p-5 space-y-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Store className="w-5 h-5 text-[#E94560]" />
          Datos del restaurante
        </h3>

        <div>
          <label className="block text-sm text-gray-400 mb-1.5">Nombre</label>
          <input
            type="text"
            value={restaurant.name}
            onChange={(e) => setRestaurant({ ...restaurant, name: e.target.value })}
            className="w-full bg-[#0a0a0f] border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#E94560]/50 focus:ring-1 focus:ring-[#E94560]/50 transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1.5">Slug</label>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">roys.app/</span>
            <input
              type="text"
              value={restaurant.slug}
              onChange={(e) =>
                setRestaurant({
                  ...restaurant,
                  slug: e.target.value.toLowerCase().replace(/\s+/g, '-'),
                })
              }
              className="flex-1 bg-[#0a0a0f] border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#E94560]/50 focus:ring-1 focus:ring-[#E94560]/50 transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1.5">Descripción</label>
          <textarea
            value={restaurant.description}
            onChange={(e) => setRestaurant({ ...restaurant, description: e.target.value })}
            className="w-full bg-[#0a0a0f] border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#E94560]/50 resize-none h-24 transition-colors"
            placeholder="Describe tu restaurante..."
          />
        </div>

        <button
          onClick={handleSave}
          className="flex items-center gap-2 bg-[#E94560] hover:bg-[#E94560]/90 text-white font-medium px-4 py-2.5 rounded-lg text-sm transition-colors"
        >
          <Save className="w-4 h-4" />
          Guardar cambios
        </button>
      </div>

      {/* TPV Integration */}
      <div className="bg-[#1a1a2e] border border-white/10 rounded-xl p-5 space-y-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Plug className="w-5 h-5 text-[#00d4ff]" />
          Integración TPV
        </h3>

        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-400">Estado:</span>
          <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-yellow-500/20 text-yellow-400">
            No conectado
          </span>
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1.5">API Key</label>
          <input
            type="text"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Ingresa tu API Key del TPV"
            className="w-full bg-[#0a0a0f] border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#E94560]/50 focus:ring-1 focus:ring-[#E94560]/50 transition-colors font-mono"
          />
          <p className="text-xs text-gray-600 mt-1">
            Conecta tu sistema TPV para sincronizar pedidos y pagos automáticamente.
          </p>
        </div>

        <button
          onClick={() => showToast('Funcionalidad próximamente disponible')}
          className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white font-medium px-4 py-2.5 rounded-lg text-sm transition-colors border border-white/10"
        >
          <Plug className="w-4 h-4" />
          Conectar TPV
        </button>
      </div>

      {/* Danger Zone */}
      <div className="bg-[#1a1a2e] border-2 border-red-500/30 rounded-xl p-5 space-y-4">
        <h3 className="text-lg font-semibold text-red-400 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" />
          Zona de peligro
        </h3>

        <p className="text-sm text-gray-400">
          Eliminar el restaurante borrará permanentemente todos los datos asociados: menú, pedidos, mesas, configuración y sesiones. Esta acción no se puede deshacer.
        </p>

        <button
          onClick={handleDelete}
          className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 font-medium px-4 py-2.5 rounded-lg text-sm transition-colors border border-red-500/30"
        >
          <Trash2 className="w-4 h-4" />
          Eliminar Restaurante
        </button>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 bg-green-500/20 border border-green-500/30 text-green-400 px-4 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 z-50">
          <Check className="w-4 h-4" />
          {toast}
        </div>
      )}
    </div>
  );
}
