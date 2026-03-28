'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Mic, Send, Keyboard } from 'lucide-react';

interface VoiceInterfaceProps {
  isListening: boolean;
  isSpeaking: boolean;
  isSupported: boolean;
  onStartListening: () => void;
  onStopListening: () => void;
  onSendText: (text: string) => void;
}

export default function VoiceInterface({
  isListening,
  isSpeaking,
  isSupported,
  onStartListening,
  onStopListening,
  onSendText,
}: VoiceInterfaceProps) {
  const [showTextInput, setShowTextInput] = useState(!isSupported);
  const [textInput, setTextInput] = useState('');

  const handleTextSubmit = useCallback(() => {
    if (textInput.trim()) {
      onSendText(textInput.trim());
      setTextInput('');
    }
  }, [textInput, onSendText]);

  return (
    <div className="w-full flex flex-col items-center gap-3 px-4">
      {showTextInput && (
        <div className="w-full max-w-md flex gap-2">
          <input
            type="text"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleTextSubmit()}
            placeholder="Escribe tu mensaje..."
            className="flex-1 bg-white/5 border border-white/10 rounded-full px-5 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-accent-cyan/50 backdrop-blur-md font-body"
          />
          <motion.button
            onClick={handleTextSubmit}
            className="w-12 h-12 rounded-full bg-accent-cyan/20 border border-accent-cyan/30 flex items-center justify-center text-accent-cyan"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Send size={18} />
          </motion.button>
        </div>
      )}

      <div className="flex items-center gap-4">
        {/* Mic button */}
        {isSupported && (
          <motion.button
            className={`relative w-20 h-20 rounded-full flex items-center justify-center transition-colors ${
              isListening
                ? 'bg-accent-red/30 border-2 border-accent-red shadow-[0_0_30px_rgba(233,69,96,0.4)]'
                : 'bg-white/5 border-2 border-white/20'
            }`}
            onPointerDown={onStartListening}
            onPointerUp={onStopListening}
            onPointerLeave={onStopListening}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={isSpeaking}
          >
            <Mic size={28} className={isListening ? 'text-accent-red' : 'text-white/60'} />

            {/* Pulse rings when listening */}
            {isListening && (
              <>
                <motion.div
                  className="absolute inset-0 rounded-full border border-accent-red/30"
                  animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                />
                <motion.div
                  className="absolute inset-0 rounded-full border border-accent-red/20"
                  animate={{ scale: [1, 1.8], opacity: [0.3, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
                />
              </>
            )}
          </motion.button>
        )}

        {/* Toggle text input */}
        {isSupported && (
          <motion.button
            onClick={() => setShowTextInput(prev => !prev)}
            className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Keyboard size={16} />
          </motion.button>
        )}
      </div>

      {isSupported && !isListening && !isSpeaking && (
        <p className="text-text-dim text-xs font-display tracking-wider">
          MANTÉN PULSADO PARA HABLAR
        </p>
      )}
    </div>
  );
}
