'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import type { Restaurant, MenuCategory, MenuItem } from '@roys/shared/types';
import { useWaiterAI } from '../../../hooks/useWaiterAI';
import { useSpeechRecognition } from '../../../hooks/useSpeechRecognition';
import { useSpeechSynthesis } from '../../../hooks/useSpeechSynthesis';
import ParticleBackground from '../../../components/ParticleBackground';
import OrbAvatar from '../../../components/OrbAvatar';
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
  const { speak, isSpeaking, preAuthorize } = useSpeechSynthesis(lang);

  const [orderPanelOpen, setOrderPanelOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [greeted, setGreeted] = useState(false);
  const pendingVoiceResponse = useRef(false);

  // Auto-greet on mount (text only)
  useEffect(() => {
    if (!greeted) {
      setGreeted(true);
      const timer = setTimeout(() => {
        sendMessage('hola');
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [greeted, sendMessage]);

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
    pendingVoiceResponse.current = true;
  }, [isSpeaking, startListening]);

  const handleStopListening = useCallback(() => {
    stopListening();
    // Pre-authorize TTS RIGHT NOW during the user gesture (touchEnd)
    // This reserves the audio context so speak() works later
    preAuthorize();
  }, [stopListening, preAuthorize]);

  // When listening stops and we have a transcript, process with voice response
  useEffect(() => {
    if (!isListening && transcript && pendingVoiceResponse.current) {
      pendingVoiceResponse.current = false;
      (async () => {
        const response = await sendMessage(transcript);
        // Speak the response — TTS was unlocked during touchStart
        speak(response);
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isListening]);

  // TEXT input → TEXT only response (no TTS)
  const handleSendText = useCallback(async (text: string) => {
    await sendMessage(text);
  }, [sendMessage]);

  const handleConfirmOrder = useCallback(async () => {
    await confirmOrder();
    speak('Pedido confirmado. Tu pedido llegara en breve.');
  }, [confirmOrder, speak]);

  return (
    <main className="fixed inset-0 flex flex-col items-center justify-between overflow-hidden bg-white">
      <ParticleBackground />

      {/* Header */}
      <div className="relative z-10 w-full flex items-center justify-between px-4 pt-4 pb-2">
        <div>
          <div className="flex items-center gap-2">
            <p className="font-display text-xs tracking-widest text-gray-400">MESA {tableNumber}</p>
            <div className="flex items-center gap-1" title={isConnectedToOpenClaw ? 'OpenClaw conectado' : 'Mock IA'}>
              <span className={`w-2 h-2 rounded-full ${isConnectedToOpenClaw ? 'bg-green-500' : 'bg-amber-400'}`} />
              <span className="font-display text-[9px] tracking-wider text-gray-400">
                {isConnectedToOpenClaw ? 'AI' : 'MOCK'}
              </span>
            </div>
          </div>
          <p className="font-body text-sm text-gray-500">{restaurant.name}</p>
        </div>

        {currentOrder.length > 0 && (
          <motion.button
            onClick={() => setOrderPanelOpen(true)}
            className="relative flex items-center gap-2 px-3 py-2 rounded-full bg-amber-50 border border-amber-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ShoppingBag size={16} className="text-amber-600" />
            <span className="text-sm font-display text-amber-700">{orderTotal.toFixed(2)}€</span>
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-amber-500 text-white text-[10px] font-bold flex items-center justify-center">
              {currentOrder.reduce((sum, item) => sum + item.quantity, 0)}
            </span>
          </motion.button>
        )}
      </div>

      {/* Orb Area */}
      <div className="relative z-10 flex-1 flex items-center justify-center">
        <OrbAvatar state={orbState} />
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
