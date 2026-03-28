'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Mic, Send, Keyboard, X } from 'lucide-react';

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
    <div className="flex flex-col items-center gap-2 px-4 py-3">
      {/* Text input area */}
      {showTextInput && (
        <div className="w-full max-w-sm flex gap-2">
          <input
            type="text"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleTextSubmit()}
            placeholder="Escribe tu mensaje..."
            className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2.5 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/10 font-body"
            autoFocus
          />
          <button
            onClick={handleTextSubmit}
            className="w-10 h-10 rounded-full bg-cyan-600 flex items-center justify-center text-white shadow-[0_0_10px_rgba(0,220,255,0.3)] active:scale-95"
          >
            <Send size={16} />
          </button>
          {isSupported && (
            <button
              onClick={() => setShowTextInput(false)}
              className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-500 active:scale-95"
            >
              <X size={16} />
            </button>
          )}
        </div>
      )}

      {/* Mic button area */}
      {!showTextInput && (
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-3">
            {isSupported && (
              <button
                className={`relative w-16 h-16 rounded-full flex items-center justify-center select-none touch-none transition-all duration-200 ${
                  isListening
                    ? 'bg-cyan-500 shadow-[0_0_30px_rgba(0,220,255,0.5)] scale-110'
                    : 'bg-white/10 border border-white/10 active:scale-95'
                } ${isSpeaking ? 'opacity-40 pointer-events-none' : ''}`}
                onTouchStart={!isSpeaking ? handleMicDown : undefined}
                onTouchEnd={!isSpeaking ? handleMicUp : undefined}
                onTouchCancel={!isSpeaking ? handleMicUp : undefined}
                onMouseDown={!isSpeaking ? handleMicDown : undefined}
                onMouseUp={!isSpeaking ? handleMicUp : undefined}
                onMouseLeave={isListening ? handleMicUp : undefined}
                onContextMenu={(e) => e.preventDefault()}
                style={{ WebkitTouchCallout: 'none', WebkitUserSelect: 'none', userSelect: 'none' }}
              >
                <Mic size={24} className={isListening ? 'text-white' : 'text-gray-400'} />

                {isListening && (
                  <>
                    <motion.div
                      className="absolute inset-0 rounded-full border-2 border-cyan-400/40"
                      animate={{ scale: [1, 1.4], opacity: [0.6, 0] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    />
                    <motion.div
                      className="absolute inset-0 rounded-full border border-cyan-300/30"
                      animate={{ scale: [1, 1.7], opacity: [0.3, 0] }}
                      transition={{ duration: 1.3, repeat: Infinity, delay: 0.2 }}
                    />
                  </>
                )}
              </button>
            )}

            {/* Toggle to text input */}
            {isSupported && (
              <button
                onClick={() => setShowTextInput(true)}
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-500 active:scale-95 active:bg-white/10"
              >
                <Keyboard size={16} />
              </button>
            )}
          </div>

          <p className="text-[11px] font-body text-gray-500 select-none">
            {isListening ? 'Escuchando...' : isSpeaking ? 'Hablando...' : 'Mantén pulsado para hablar'}
          </p>
        </div>
      )}
    </div>
  );
}
