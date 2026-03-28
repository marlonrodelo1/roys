'use client';

import { motion, AnimatePresence } from 'framer-motion';

type OrbState = 'idle' | 'listening' | 'thinking' | 'speaking';

const stateConfig = {
  idle: {
    gradient: 'radial-gradient(circle, #1a1a3e, #0a0a1a)',
    scale: [0.95, 1.05, 0.95],
    shadow: '0 0 60px rgba(26, 26, 62, 0.4)',
    ringSpeed: 16,
    label: '',
  },
  listening: {
    gradient: 'radial-gradient(circle, #E94560, #8b1a2b)',
    scale: [1.1, 1.18, 1.1],
    shadow: '0 0 80px rgba(233, 69, 96, 0.5)',
    ringSpeed: 4,
    label: 'Escuchando...',
  },
  thinking: {
    gradient: 'radial-gradient(circle, #16C79A, #0a3d2e)',
    scale: [0.98, 1.04, 0.98],
    shadow: '0 0 60px rgba(22, 199, 154, 0.4)',
    ringSpeed: 2,
    label: 'Procesando...',
  },
  speaking: {
    gradient: 'radial-gradient(circle, #00d4ff, #0F3460)',
    scale: [1.0, 1.08, 1.0],
    shadow: '0 0 100px rgba(0, 212, 255, 0.5)',
    ringSpeed: 8,
    label: '',
  },
};

interface OrbAvatarProps {
  state: OrbState;
}

export default function OrbAvatar({ state }: OrbAvatarProps) {
  const config = stateConfig[state];

  return (
    <div className="relative flex items-center justify-center">
      {/* Glow background */}
      <motion.div
        className="absolute rounded-full"
        style={{ width: 280, height: 280 }}
        animate={{
          boxShadow: config.shadow,
          opacity: [0.3, 0.7, 0.3],
        }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Orbital ring 1 */}
      <motion.div
        className="absolute rounded-full border border-white/10"
        style={{ width: 260, height: 260 }}
        animate={{ rotate: 360 }}
        transition={{ duration: config.ringSpeed, repeat: Infinity, ease: 'linear' }}
      />

      {/* Orbital ring 2 */}
      <motion.div
        className="absolute rounded-full border border-white/5"
        style={{ width: 300, height: 300, borderStyle: 'dashed' }}
        animate={{ rotate: -360 }}
        transition={{ duration: config.ringSpeed * 1.5, repeat: Infinity, ease: 'linear' }}
      />

      {/* Orbital ring 3 */}
      <motion.div
        className="absolute rounded-full border border-cyan-500/10"
        style={{ width: 340, height: 340 }}
        animate={{ rotate: 360 }}
        transition={{ duration: config.ringSpeed * 2, repeat: Infinity, ease: 'linear' }}
      />

      {/* Main orb */}
      <motion.div
        className="relative rounded-full flex items-center justify-center backdrop-blur-sm"
        style={{ width: 200, height: 200 }}
        animate={{
          background: config.gradient,
          scale: config.scale,
          boxShadow: config.shadow,
        }}
        transition={{
          background: { duration: 0.6 },
          scale: { duration: state === 'thinking' ? 0.8 : 3, repeat: Infinity, ease: 'easeInOut' },
          boxShadow: { duration: 0.6 },
        }}
      >
        {/* Inner glow */}
        <div className="absolute inset-4 rounded-full bg-white/5 backdrop-blur-md" />

        {/* Center dot */}
        <motion.div
          className="w-3 h-3 rounded-full bg-white/30"
          animate={{ opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </motion.div>

      {/* State label */}
      <AnimatePresence>
        {config.label && (
          <motion.div
            className="absolute -bottom-12 font-display text-sm tracking-widest uppercase"
            style={{ color: state === 'listening' ? '#E94560' : state === 'thinking' ? '#16C79A' : '#00d4ff' }}
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            {config.label}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
