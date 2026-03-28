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

  // Prevent text selection and default touch behavior on mic button
  const handleMicDown = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onStartListening();
  }, [onStartListening]);

  const handleMicUp = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onStopListening();
  }, [onStopListening]);

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
            className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-5 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 font-body"
          />
          <motion.button
            onClick={handleTextSubmit}
            className="w-12 h-12 rounded-full bg-amber-500 flex items-center justify-center text-white shadow-md"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Send size={18} />
          </motion.button>
        </div>
      )}

      <div className="flex items-center gap-4">
        {/* Mic button - uses touch events for mobile */}
        {isSupported && (
          <button
            className={`relative w-20 h-20 rounded-full flex items-center justify-center select-none touch-none ${
              isListening
                ? 'bg-amber-500 border-2 border-amber-400 shadow-[0_0_30px_rgba(245,158,11,0.4)]'
                : 'bg-gray-100 border-2 border-gray-200'
            } ${isSpeaking ? 'opacity-50' : ''}`}
            onTouchStart={!isSpeaking ? handleMicDown : undefined}
            onTouchEnd={!isSpeaking ? handleMicUp : undefined}
            onTouchCancel={!isSpeaking ? handleMicUp : undefined}
            onMouseDown={!isSpeaking ? handleMicDown : undefined}
            onMouseUp={!isSpeaking ? handleMicUp : undefined}
            onMouseLeave={isListening ? handleMicUp : undefined}
            onContextMenu={(e) => e.preventDefault()}
            style={{ WebkitTouchCallout: 'none', WebkitUserSelect: 'none', userSelect: 'none' }}
          >
            <Mic size={28} className={isListening ? 'text-white' : 'text-gray-500'} />

            {/* Pulse rings when listening */}
            {isListening && (
              <>
                <motion.div
                  className="absolute inset-0 rounded-full border border-amber-400/40"
                  animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                />
                <motion.div
                  className="absolute inset-0 rounded-full border border-amber-300/30"
                  animate={{ scale: [1, 1.8], opacity: [0.3, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
                />
              </>
            )}
          </button>
        )}

        {/* Toggle text input */}
        {isSupported && (
          <button
            onClick={() => setShowTextInput(prev => !prev)}
            className="w-10 h-10 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400 active:bg-gray-200"
          >
            <Keyboard size={16} />
          </button>
        )}
      </div>

      {isSupported && !isListening && !isSpeaking && (
        <p className="text-gray-400 text-xs font-display tracking-wider select-none">
          MANTEN PULSADO PARA HABLAR
        </p>
      )}
    </div>
  );
}
