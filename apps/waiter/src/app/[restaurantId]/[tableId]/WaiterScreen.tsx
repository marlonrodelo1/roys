'use client';

import { useState, useCallback, useEffect } from 'react';
import type { Restaurant, MenuCategory, MenuItem } from '@roys/shared/types';
import { useWaiterAI } from '../../../hooks/useWaiterAI';
import { useSpeechRecognition } from '../../../hooks/useSpeechRecognition';
import { useSpeechSynthesis } from '../../../hooks/useSpeechSynthesis';
import ParticleBackground from '../../../components/ParticleBackground';
import OrbAvatar from '../../../components/OrbAvatar';
import WaveVisualizer from '../../../components/WaveVisualizer';
import ChatBubbles from '../../../components/ChatBubbles';
import VoiceInterface from '../../../components/VoiceInterface';
import OrderSummary from '../../../components/OrderSummary';
import ConfirmDialog from '../../../components/ConfirmDialog';
import { ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';

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
  const { speak, isSpeaking, isSupported: ttsSupported } = useSpeechSynthesis(lang);

  const [orderPanelOpen, setOrderPanelOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [greeted, setGreeted] = useState(false);

  // Auto-greet on mount
  useEffect(() => {
    if (!greeted) {
      setGreeted(true);
      const timer = setTimeout(async () => {
        const response = await sendMessage('hola');
        if (ttsSupported) speak(response);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [greeted, sendMessage, speak, ttsSupported]);

  // Sync orb state with speech
  useEffect(() => {
    if (isListening) setOrbState('listening');
    else if (isSpeaking) setOrbState('speaking');
  }, [isListening, isSpeaking, setOrbState]);

  // When speaking ends, go back to idle
  useEffect(() => {
    if (!isSpeaking && orbState === 'speaking') {
      const timer = setTimeout(() => setOrbState('idle'), 500);
      return () => clearTimeout(timer);
    }
  }, [isSpeaking, orbState, setOrbState]);

  const handleStartListening = useCallback(() => {
    if (isSpeaking) return;
    startListening();
  }, [isSpeaking, startListening]);

  const handleStopListening = useCallback(async () => {
    stopListening();
    // Wait a tick for final transcript
    await new Promise(resolve => setTimeout(resolve, 300));
  }, [stopListening]);

  // Process transcript when listening stops
  useEffect(() => {
    if (!isListening && transcript) {
      (async () => {
        const response = await sendMessage(transcript);
        if (ttsSupported) speak(response);
      })();
    }
    // Only trigger when isListening changes to false with a transcript
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isListening]);

  const handleSendText = useCallback(async (text: string) => {
    const response = await sendMessage(text);
    if (ttsSupported) speak(response);
  }, [sendMessage, speak, ttsSupported]);

  const handleConfirmOrder = useCallback(async () => {
    await confirmOrder();
    const confirmText = '¡Pedido confirmado! Tu pedido llegará en breve. ¿Necesitas algo más?';
    if (ttsSupported) speak(confirmText);
  }, [confirmOrder, speak, ttsSupported]);

  return (
    <main className="fixed inset-0 flex flex-col items-center justify-between overflow-hidden bg-[#050508]">
      <ParticleBackground />

      {/* Header */}
      <div className="relative z-10 w-full flex items-center justify-between px-4 pt-4 pb-2">
        <div>
          <div className="flex items-center gap-2">
            <p className="font-display text-xs tracking-widest text-white/30">MESA {tableNumber}</p>
            <div className="flex items-center gap-1" title={isConnectedToOpenClaw ? 'OpenClaw conectado' : 'Mock IA'}>
              <span className={`w-2 h-2 rounded-full ${isConnectedToOpenClaw ? 'bg-green-400 shadow-[0_0_6px_rgba(74,222,128,0.6)]' : 'bg-yellow-400 shadow-[0_0_6px_rgba(250,204,21,0.6)]'}`} />
              <span className="font-display text-[9px] tracking-wider text-white/25">
                {isConnectedToOpenClaw ? 'AI' : 'MOCK'}
              </span>
            </div>
          </div>
          <p className="font-body text-sm text-white/50">{restaurant.name}</p>
        </div>

        {/* Order badge */}
        {currentOrder.length > 0 && (
          <motion.button
            onClick={() => setOrderPanelOpen(true)}
            className="relative flex items-center gap-2 px-3 py-2 rounded-full bg-white/5 border border-white/10"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ShoppingBag size={16} className="text-accent-cyan" />
            <span className="text-sm font-display text-accent-cyan">{orderTotal.toFixed(2)}€</span>
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-accent-red text-[10px] font-bold flex items-center justify-center">
              {currentOrder.reduce((sum, item) => sum + item.quantity, 0)}
            </span>
          </motion.button>
        )}
      </div>

      {/* Orb Area */}
      <div className="relative z-10 flex-1 flex items-center justify-center">
        <div className="relative">
          <OrbAvatar state={orbState} />
          <WaveVisualizer state={orbState} />
        </div>
      </div>

      {/* Chat + Voice */}
      <div className="relative z-10 w-full pb-6 space-y-4">
        <ChatBubbles messages={messages} />
        <VoiceInterface
          isListening={isListening}
          isSpeaking={isSpeaking}
          isSupported={sttSupported}
          onStartListening={handleStartListening}
          onStopListening={handleStopListening}
          onSendText={handleSendText}
        />
      </div>

      {/* Order Panel */}
      <OrderSummary
        items={currentOrder}
        total={orderTotal}
        isOpen={orderPanelOpen}
        onClose={() => setOrderPanelOpen(false)}
        onConfirm={() => {
          setOrderPanelOpen(false);
          setConfirmOpen(true);
        }}
      />

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirmOrder}
        total={orderTotal}
        itemCount={currentOrder.reduce((sum, item) => sum + item.quantity, 0)}
      />
    </main>
  );
}
