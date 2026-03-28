'use client';

import { useState, useCallback, useRef, useEffect } from 'react';

interface UseSpeechSynthesisReturn {
  speak: (text: string) => void;
  stop: () => void;
  isSpeaking: boolean;
  isSupported: boolean;
}

export function useSpeechSynthesis(lang: string = 'es-ES'): UseSpeechSynthesisReturn {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null);
  const resumeInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  const isSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;

  useEffect(() => {
    if (!isSupported) return;

    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      // Prefer a Spanish voice
      const spanishVoice = voices.find(v => v.lang.startsWith(lang.split('-')[0]));
      voiceRef.current = spanishVoice || voices[0] || null;
      console.log('[TTS] Voices loaded:', voices.length, 'Selected:', voiceRef.current?.name);
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, [isSupported, lang]);

  const speak = useCallback((text: string) => {
    if (!isSupported || !text) {
      console.log('[TTS] Not supported or empty text');
      return;
    }

    console.log('[TTS] Speaking:', text.substring(0, 50) + '...');

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    // Small delay after cancel to avoid Chrome bug
    setTimeout(() => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 1;

      if (voiceRef.current) {
        utterance.voice = voiceRef.current;
      }

      utterance.onstart = () => {
        console.log('[TTS] Started speaking');
        setIsSpeaking(true);
      };

      utterance.onend = () => {
        console.log('[TTS] Finished speaking');
        setIsSpeaking(false);
        if (resumeInterval.current) {
          clearInterval(resumeInterval.current);
          resumeInterval.current = null;
        }
      };

      utterance.onerror = (e) => {
        console.error('[TTS] Error:', e.error);
        setIsSpeaking(false);
        if (resumeInterval.current) {
          clearInterval(resumeInterval.current);
          resumeInterval.current = null;
        }
      };

      window.speechSynthesis.speak(utterance);

      // Chrome mobile bug: speech pauses after ~15 seconds
      // Workaround: periodically call resume()
      resumeInterval.current = setInterval(() => {
        if (window.speechSynthesis.speaking) {
          window.speechSynthesis.resume();
        } else {
          if (resumeInterval.current) {
            clearInterval(resumeInterval.current);
            resumeInterval.current = null;
          }
        }
      }, 5000);
    }, 100);
  }, [isSupported, lang]);

  const stop = useCallback(() => {
    if (isSupported) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      if (resumeInterval.current) {
        clearInterval(resumeInterval.current);
        resumeInterval.current = null;
      }
    }
  }, [isSupported]);

  return { speak, stop, isSpeaking, isSupported };
}
