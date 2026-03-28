'use client';

import { useState, useCallback, useRef, useEffect } from 'react';

interface UseSpeechSynthesisReturn {
  speak: (text: string) => void;
  stop: () => void;
  isSpeaking: boolean;
  isSupported: boolean;
  /** Call this during a user gesture to pre-authorize TTS for the next speak() call */
  preAuthorize: () => void;
}

export function useSpeechSynthesis(lang: string = 'es-ES'): UseSpeechSynthesisReturn {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null);
  const resumeInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const pendingUtterance = useRef<SpeechSynthesisUtterance | null>(null);

  const isSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;

  useEffect(() => {
    if (!isSupported) return;

    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      const spanishVoice = voices.find(v => v.lang.startsWith(lang.split('-')[0]));
      voiceRef.current = spanishVoice || voices[0] || null;
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, [isSupported, lang]);

  /**
   * Call during a user gesture (touchEnd, click) to create and queue
   * an empty utterance. This "reserves" the audio context.
   * Then when speak() is called later, it replaces the text.
   */
  const preAuthorize = useCallback(() => {
    if (!isSupported) return;

    window.speechSynthesis.cancel();

    // Create a placeholder utterance and queue it during the gesture
    const utterance = new SpeechSynthesisUtterance('');
    utterance.lang = lang;
    utterance.rate = 0.9;
    utterance.volume = 1;

    if (voiceRef.current) {
      utterance.voice = voiceRef.current;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => {
      setIsSpeaking(false);
      clearResumeInterval();
    };
    utterance.onerror = () => {
      setIsSpeaking(false);
      clearResumeInterval();
    };

    // Store it — speak() will cancel this and speak the real text
    // But the audio context is now authorized
    pendingUtterance.current = utterance;
    window.speechSynthesis.speak(utterance);

    // Start resume interval for Chrome
    startResumeInterval();
  }, [isSupported, lang]);

  const startResumeInterval = () => {
    clearResumeInterval();
    resumeInterval.current = setInterval(() => {
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.resume();
      } else {
        clearResumeInterval();
      }
    }, 5000);
  };

  const clearResumeInterval = () => {
    if (resumeInterval.current) {
      clearInterval(resumeInterval.current);
      resumeInterval.current = null;
    }
  };

  const speak = useCallback((text: string) => {
    if (!isSupported || !text) return;

    // Cancel the pre-authorized empty utterance (or any ongoing speech)
    window.speechSynthesis.cancel();
    pendingUtterance.current = null;

    // Small delay after cancel
    setTimeout(() => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 1;

      if (voiceRef.current) {
        utterance.voice = voiceRef.current;
      }

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => {
        setIsSpeaking(false);
        clearResumeInterval();
      };
      utterance.onerror = () => {
        setIsSpeaking(false);
        clearResumeInterval();
      };

      window.speechSynthesis.speak(utterance);
      startResumeInterval();
    }, 50);
  }, [isSupported, lang]);

  const stop = useCallback(() => {
    if (isSupported) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      clearResumeInterval();
      pendingUtterance.current = null;
    }
  }, [isSupported]);

  return { speak, stop, isSpeaking, isSupported, preAuthorize };
}
