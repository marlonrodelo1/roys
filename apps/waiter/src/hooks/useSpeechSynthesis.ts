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
  const queueRef = useRef<string | null>(null);
  const keepAliveRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const isSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;

  // Load voices
  useEffect(() => {
    if (!isSupported) return;

    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      const langPrefix = lang.split('-')[0];
      const langVoices = voices.filter(v => v.lang.startsWith(langPrefix));

      // Prefer natural/neural voices over robotic ones
      const naturalKeywords = ['google', 'neural', 'natural', 'online', 'enhanced', 'premium'];
      const roboticKeywords = ['espeak', 'mbrola', 'festival'];

      const ranked = langVoices
        .filter(v => !roboticKeywords.some(k => v.name.toLowerCase().includes(k)))
        .sort((a, b) => {
          const scoreA = naturalKeywords.filter(k => a.name.toLowerCase().includes(k)).length;
          const scoreB = naturalKeywords.filter(k => b.name.toLowerCase().includes(k)).length;
          return scoreB - scoreA;
        });

      voiceRef.current = ranked[0] || langVoices[0] || voices[0] || null;
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    // Unlock TTS on first touch ANYWHERE on the page
    const handleTouch = () => {
      if (!unlocked.current) {
        // Speak a silent utterance to unlock the audio pipeline
        const u = new SpeechSynthesisUtterance(' ');
        u.volume = 0.01;
        u.rate = 10;
        if (voiceRef.current) u.voice = voiceRef.current;
        u.lang = lang;
        window.speechSynthesis.speak(u);
        unlocked.current = true;

        // Start keep-alive: mobile browsers kill the synth if idle too long
        if (!keepAliveRef.current) {
          keepAliveRef.current = setInterval(() => {
            if (!window.speechSynthesis.speaking) {
              const ping = new SpeechSynthesisUtterance(' ');
              ping.volume = 0.01;
              ping.rate = 10;
              if (voiceRef.current) ping.voice = voiceRef.current;
              ping.lang = lang;
              window.speechSynthesis.speak(ping);
            }
          }, 10000);
        }

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
      if (keepAliveRef.current) {
        clearInterval(keepAliveRef.current);
        keepAliveRef.current = null;
      }
    };
  }, [isSupported, lang]);

  const preAuthorize = useCallback(() => {
    if (!isSupported) return;
    // Called during user gesture (touchend on mic button)
    // Speak silent utterance to keep the pipeline warm for the upcoming response
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(' ');
    u.volume = 0.01;
    u.rate = 10;
    if (voiceRef.current) u.voice = voiceRef.current;
    u.lang = lang;

    // If there's already a queued response (fast API), speak it now
    u.onend = () => {
      if (queueRef.current) {
        const text = queueRef.current;
        queueRef.current = null;
        speakNow(text);
      }
    };

    window.speechSynthesis.speak(u);
  }, [isSupported, lang]);

  const speakNow = useCallback((text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.95;
    utterance.pitch = 1.05;
    utterance.volume = 1;

    if (voiceRef.current) {
      utterance.voice = voiceRef.current;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onerror = (e) => {
      // On error, try once more without voice selection (fallback)
      if (e.error !== 'canceled') {
        const fallback = new SpeechSynthesisUtterance(text);
        fallback.lang = lang;
        fallback.rate = 0.95;
        fallback.pitch = 1.05;
        fallback.volume = 1;
        fallback.onstart = () => setIsSpeaking(true);
        fallback.onend = () => setIsSpeaking(false);
        fallback.onerror = () => setIsSpeaking(false);
        window.speechSynthesis.speak(fallback);
      } else {
        setIsSpeaking(false);
      }
    };

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

    window.speechSynthesis.speak(utterance);
  }, [lang]);

  const speak = useCallback((text: string) => {
    if (!isSupported || !text) return;

    // If synthesis is currently speaking a keep-alive/preauth ping,
    // queue the text — it will be picked up when the ping ends
    if (window.speechSynthesis.speaking) {
      // Cancel any silent pings and speak immediately
      window.speechSynthesis.cancel();
      // Small delay after cancel for mobile browsers
      setTimeout(() => speakNow(text), 50);
    } else {
      speakNow(text);
    }
  }, [isSupported, speakNow]);

  const stop = useCallback(() => {
    if (isSupported) {
      window.speechSynthesis.cancel();
      queueRef.current = null;
      setIsSpeaking(false);
    }
  }, [isSupported]);

  return { speak, stop, isSpeaking, isSupported, preAuthorize };
}
