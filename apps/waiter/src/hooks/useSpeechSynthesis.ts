'use client';

import { useState, useCallback, useRef, useEffect } from 'react';

interface UseSpeechSynthesisReturn {
  speak: (text: string) => void;
  stop: () => void;
  isSpeaking: boolean;
  isSupported: boolean;
  preAuthorize: () => void;
}

export function useSpeechSynthesis(lang: string = 'es-ES'): UseSpeechSynthesisReturn {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null);
  const unlocked = useRef(false);

  const isSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;

  // Load voices
  useEffect(() => {
    if (!isSupported) return;

    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      const match = voices.find(v => v.lang.startsWith(lang.split('-')[0]));
      voiceRef.current = match || voices[0] || null;
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    // Unlock TTS on first touch ANYWHERE on the page
    const handleTouch = () => {
      if (!unlocked.current) {
        const u = new SpeechSynthesisUtterance('');
        window.speechSynthesis.speak(u);
        unlocked.current = true;
        document.removeEventListener('touchstart', handleTouch);
        document.removeEventListener('touchend', handleTouch);
        document.removeEventListener('click', handleTouch);
      }
    };

    document.addEventListener('touchstart', handleTouch, { once: false });
    document.addEventListener('touchend', handleTouch, { once: false });
    document.addEventListener('click', handleTouch, { once: false });

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
      document.removeEventListener('touchstart', handleTouch);
      document.removeEventListener('touchend', handleTouch);
      document.removeEventListener('click', handleTouch);
    };
  }, [isSupported, lang]);

  const preAuthorize = useCallback(() => {
    if (!isSupported) return;
    // Additional pre-auth during explicit gesture
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance('');
    window.speechSynthesis.speak(u);
  }, [isSupported]);

  const speak = useCallback((text: string) => {
    if (!isSupported || !text) return;

    window.speechSynthesis.cancel();

    // Delay to let cancel take effect
    setTimeout(() => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = 0.9;
      utterance.volume = 1;

      if (voiceRef.current) {
        utterance.voice = voiceRef.current;
      }

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);

      // Chrome bug: long utterances pause after ~15s
      const interval = setInterval(() => {
        if (window.speechSynthesis.speaking) {
          window.speechSynthesis.resume();
        } else {
          clearInterval(interval);
        }
      }, 5000);

      utterance.onend = () => {
        setIsSpeaking(false);
        clearInterval(interval);
      };
    }, 100);
  }, [isSupported, lang]);

  const stop = useCallback(() => {
    if (isSupported) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, [isSupported]);

  return { speak, stop, isSpeaking, isSupported, preAuthorize };
}
