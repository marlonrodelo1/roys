'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import type { Restaurant, MenuCategory, MenuItem } from '@roys/shared/types';
import { useWaiterAI } from '../../../hooks/useWaiterAI';
import { useSpeechRecognition } from '../../../hooks/useSpeechRecognition';
import { useSpeechSynthesis } from '../../../hooks/useSpeechSynthesis';
import OrbAvatar from '../../../components/OrbAvatar';
import ChatBubbles from '../../../components/ChatBubbles';
import VoiceInterface from '../../../components/VoiceInterface';
import OrderSummary from '../../../components/OrderSummary';
import ConfirmDialog from '../../../components/ConfirmDialog';
import { ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface WaiterScreenProps {
  restaurant: Restaurant;
  categories: MenuCategory[];
  menuItems: MenuItem[];
  tableNumber: number;
}

export default function WaiterScreen({ restaurant, categories, menuItems, tableNumber }: WaiterScreenProps) {
  const langMap: Record<string, string> = { es: 'es-ES', en: 'en-US', fr: 'fr-FR', de: 'de-DE', it: 'it-IT' };
  const lang = langMap[restaurant.bot_language] || 'es-ES';

  const {
    messages, currentOrder, orbState, sendMessage, confirmOrder,
    setOrbState, orderTotal, isConnectedToOpenClaw,
  } = useWaiterAI(restaurant, categories, menuItems, tableNumber);

  const { transcript, isListening, startListening, stopListening, isSupported: sttSupported } = useSpeechRecognition(lang);
  const { speak, isSpeaking, preAuthorize } = useSpeechSynthesis(lang);

  const [orderPanelOpen, setOrderPanelOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [greeted, setGreeted] = useState(false);
  const pendingVoiceResponse = useRef(false);

  // Whether orb should be compact (when there are messages)
  const isCompact = messages.length > 2;

  // Auto-greet on mount (text only — browsers block auto-play audio)
  useEffect(() => {
    if (!greeted) {
      setGreeted(true);
      const timer = setTimeout(() => { sendMessage('hola'); }, 1500);
      return () => clearTimeout(timer);
    }
  }, [greeted, sendMessage]);

  // Sync orb state with speech
  useEffect(() => {
    if (isListening) setOrbState('listening');
    else if (isSpeaking) setOrbState('speaking');
  }, [isListening, isSpeaking, setOrbState]);

  useEffect(() => {
    if (!isSpeaking && orbState === 'speaking') {
      const timer = setTimeout(() => setOrbState('idle'), 500);
      return () => clearTimeout(timer);
    }
  }, [isSpeaking, orbState, setOrbState]);

  const handleStartListening = useCallback(() => {
    if (isSpeaking) return;
    // Haptic feedback
    if (navigator.vibrate) navigator.vibrate(30);
    startListening();
    pendingVoiceResponse.current = true;
  }, [isSpeaking, startListening]);

  const handleStopListening = useCallback(() => {
    stopListening();
    preAuthorize();
  }, [stopListening, preAuthorize]);

  useEffect(() => {
    if (!isListening && transcript && pendingVoiceResponse.current) {
      pendingVoiceResponse.current = false;
      (async () => {
        const response = await sendMessage(transcript);
        speak(response);
      })();
    }
  }, [isListening]);

  const handleSendText = useCallback(async (text: string) => {
    await sendMessage(text);
  }, [sendMessage]);

  const handleConfirmOrder = useCallback(async () => {
    await confirmOrder();
    speak('Pedido confirmado. Tu pedido llegará en breve.');
  }, [confirmOrder, speak]);

  const itemCount = currentOrder.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="fixed inset-0 flex flex-col bg-black" style={{ height: '100dvh' }}>

      {/* === HEADER — Fixed top === */}
      <header className="flex-shrink-0 flex items-center justify-between px-4 py-3 bg-black/80 backdrop-blur-sm border-b border-white/5 z-20">
        <div>
          <div className="flex items-center gap-2">
            <p className="font-display text-[10px] tracking-[0.2em] text-gray-500 uppercase">Mesa {tableNumber}</p>
            <span className={`w-1.5 h-1.5 rounded-full ${isConnectedToOpenClaw ? 'bg-cyan-500 shadow-[0_0_6px_rgba(0,220,255,0.6)]' : 'bg-amber-400'}`} title={isConnectedToOpenClaw ? 'IA conectada' : 'Modo demo'} />
          </div>
          <p className="font-body text-sm font-medium text-gray-300">{restaurant.name}</p>
        </div>

        {/* Order badge */}
        <AnimatePresence>
          {itemCount > 0 && (
            <motion.button
              onClick={() => setOrderPanelOpen(true)}
              className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cyan-950/50 border border-cyan-500/30 active:scale-95 transition-transform"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
            >
              <ShoppingBag size={14} className="text-cyan-400" />
              <span className="text-xs font-semibold text-cyan-300">{orderTotal.toFixed(2)}€</span>
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-cyan-500 text-black text-[10px] font-bold flex items-center justify-center shadow-[0_0_8px_rgba(0,220,255,0.4)]">
                {itemCount}
              </span>
            </motion.button>
          )}
        </AnimatePresence>
      </header>

      {/* === CENTER — Scrollable area with orb + chat === */}
      <main className="flex-1 min-h-0 flex flex-col overflow-hidden">
        {/* Orb - shrinks when chat grows */}
        <div className={`flex-shrink-0 flex items-center justify-center transition-all duration-500 ${isCompact ? 'py-2' : 'py-6'}`}>
          <div className={`transition-transform duration-500 ${isCompact ? 'scale-[0.6]' : 'scale-100'}`}>
            <OrbAvatar state={orbState} />
          </div>
        </div>

        {/* Chat area - scrollable */}
        <div className="flex-1 min-h-0 overflow-y-auto px-2">
          <ChatBubbles messages={messages} isThinking={orbState === 'thinking'} />
        </div>
      </main>

      {/* === FOOTER — Fixed bottom, NEVER moves === */}
      <footer className="flex-shrink-0 bg-black/80 backdrop-blur-sm border-t border-white/5 z-20 pb-[env(safe-area-inset-bottom)]">
        <VoiceInterface
          isListening={isListening}
          isSpeaking={isSpeaking}
          isSupported={sttSupported}
          onStartListening={handleStartListening}
          onStopListening={handleStopListening}
          onSendText={handleSendText}
        />
      </footer>

      {/* Order Panel — Bottom sheet */}
      <OrderSummary
        items={currentOrder}
        total={orderTotal}
        isOpen={orderPanelOpen}
        onClose={() => setOrderPanelOpen(false)}
        onConfirm={() => { setOrderPanelOpen(false); setConfirmOpen(true); }}
      />

      <ConfirmDialog
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirmOrder}
        total={orderTotal}
        itemCount={itemCount}
      />
    </div>
  );
}
