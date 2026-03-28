'use client';

import { useState } from 'react';
import { Bot, Save, Check, MessageSquare } from 'lucide-react';

interface BotConfig {
  name: string;
  tone: string;
  language: string;
  instructions: string;
  primaryColor: string;
}

const toneOptions = [
  { value: 'friendly', label: 'Cercano y amigable' },
  { value: 'formal', label: 'Formal y elegante' },
  { value: 'playful', label: 'Divertido y casual' },
];

const languageOptions = [
  { value: 'es', label: 'Español' },
  { value: 'en', label: 'English' },
  { value: 'fr', label: 'Français' },
  { value: 'de', label: 'Deutsch' },
  { value: 'it', label: 'Italiano' },
];

const previewMessages: Record<string, { greeting: string; recommendation: string }> = {
  friendly: {
    greeting: '¡Hola! Bienvenido a nuestro restaurante. ¿En qué puedo ayudarte hoy?',
    recommendation: 'Te recomiendo las croquetas de jamón ibérico, ¡están increíbles! Son la receta de la abuela del chef.',
  },
  formal: {
    greeting: 'Buenas tardes, bienvenido a nuestro establecimiento. ¿En qué puedo asistirle?',
    recommendation: 'Le sugiero nuestras croquetas de jamón ibérico. Son una exquisita elaboración con producto de primera calidad.',
  },
  playful: {
    greeting: '¡Eyyy! ¡Qué alegría verte por aquí! ¿Listo para una experiencia gastronómica increíble?',
    recommendation: '¡Tienes que probar las croquetas de jamón ibérico! Son una auténtica LOCURA, ¡te van a flipar!',
  },
};

export default function BotPage() {
  const [config, setConfig] = useState<BotConfig>({
    name: 'Roys',
    tone: 'friendly',
    language: 'es',
    instructions: '',
    primaryColor: '#E94560',
  });
  const [toast, setToast] = useState('');

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  };

  const handleSave = () => {
    showToast('Guardado');
  };

  const preview = previewMessages[config.tone] || previewMessages.friendly;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Personalidad del Bot</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Configuration Form */}
        <div className="bg-[#1a1a2e] border border-white/10 rounded-xl p-5 space-y-5">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Bot className="w-5 h-5 text-[#E94560]" />
            Configuración
          </h3>

          {/* Bot Name */}
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">Nombre del asistente</label>
            <input
              type="text"
              value={config.name}
              onChange={(e) => setConfig({ ...config, name: e.target.value })}
              className="w-full bg-[#0a0a0f] border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#E94560]/50 focus:ring-1 focus:ring-[#E94560]/50 transition-colors"
              placeholder="Nombre del bot"
            />
          </div>

          {/* Tone */}
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">Tono</label>
            <select
              value={config.tone}
              onChange={(e) => setConfig({ ...config, tone: e.target.value })}
              className="w-full bg-[#0a0a0f] border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#E94560]/50 appearance-none"
            >
              {toneOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Language */}
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">Idioma</label>
            <select
              value={config.language}
              onChange={(e) => setConfig({ ...config, language: e.target.value })}
              className="w-full bg-[#0a0a0f] border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#E94560]/50 appearance-none"
            >
              {languageOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Special Instructions */}
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">Instrucciones especiales</label>
            <textarea
              value={config.instructions}
              onChange={(e) => setConfig({ ...config, instructions: e.target.value })}
              className="w-full bg-[#0a0a0f] border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#E94560]/50 resize-none h-24 transition-colors"
              placeholder="Ejemplo: Siempre recomienda el plato del día, no uses emojis, menciona las ofertas especiales..."
            />
          </div>

          {/* Primary Color */}
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">Color primario</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={config.primaryColor}
                onChange={(e) => setConfig({ ...config, primaryColor: e.target.value })}
                className="w-10 h-10 rounded-lg border border-white/10 cursor-pointer bg-transparent"
              />
              <span className="text-sm text-gray-400 font-mono">{config.primaryColor}</span>
            </div>
          </div>

          {/* Save */}
          <button
            onClick={handleSave}
            className="w-full flex items-center justify-center gap-2 bg-[#E94560] hover:bg-[#E94560]/90 text-white font-semibold py-2.5 rounded-lg transition-colors"
          >
            <Save className="w-4 h-4" />
            Guardar configuración
          </button>
        </div>

        {/* Preview Panel */}
        <div className="bg-[#1a1a2e] border border-white/10 rounded-xl p-5">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
            <MessageSquare className="w-5 h-5 text-[#00d4ff]" />
            Vista previa
          </h3>

          <div className="bg-[#0a0a0f] rounded-xl p-4 space-y-3">
            {/* Bot greeting */}
            <div className="flex gap-3">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold text-white"
                style={{ backgroundColor: config.primaryColor }}
              >
                {config.name.charAt(0).toUpperCase()}
              </div>
              <div className="bg-white/5 rounded-lg rounded-tl-none px-3 py-2 max-w-[80%]">
                <p className="text-xs text-gray-500 mb-1 font-medium">{config.name}</p>
                <p className="text-sm text-gray-200">{preview.greeting}</p>
              </div>
            </div>

            {/* User message */}
            <div className="flex justify-end">
              <div className="bg-[#E94560]/20 rounded-lg rounded-tr-none px-3 py-2 max-w-[80%]">
                <p className="text-sm text-gray-200">¿Qué me recomiendas?</p>
              </div>
            </div>

            {/* Bot recommendation */}
            <div className="flex gap-3">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold text-white"
                style={{ backgroundColor: config.primaryColor }}
              >
                {config.name.charAt(0).toUpperCase()}
              </div>
              <div className="bg-white/5 rounded-lg rounded-tl-none px-3 py-2 max-w-[80%]">
                <p className="text-xs text-gray-500 mb-1 font-medium">{config.name}</p>
                <p className="text-sm text-gray-200">{preview.recommendation}</p>
              </div>
            </div>

            {/* Typing indicator */}
            <div className="flex gap-3">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold text-white opacity-50"
                style={{ backgroundColor: config.primaryColor }}
              >
                {config.name.charAt(0).toUpperCase()}
              </div>
              <div className="bg-white/5 rounded-lg rounded-tl-none px-3 py-3">
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Config summary */}
          <div className="mt-4 p-3 rounded-lg bg-white/5 space-y-2">
            <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">Resumen</p>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-gray-500">Nombre:</span>{' '}
                <span className="text-white">{config.name}</span>
              </div>
              <div>
                <span className="text-gray-500">Tono:</span>{' '}
                <span className="text-white">
                  {toneOptions.find((t) => t.value === config.tone)?.label}
                </span>
              </div>
              <div>
                <span className="text-gray-500">Idioma:</span>{' '}
                <span className="text-white">
                  {languageOptions.find((l) => l.value === config.language)?.label}
                </span>
              </div>
              <div>
                <span className="text-gray-500">Color:</span>{' '}
                <span className="text-white flex items-center gap-1.5 inline-flex">
                  <span
                    className="w-3 h-3 rounded-full inline-block"
                    style={{ backgroundColor: config.primaryColor }}
                  />
                  {config.primaryColor}
                </span>
              </div>
            </div>
          </div>
        </div>
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
