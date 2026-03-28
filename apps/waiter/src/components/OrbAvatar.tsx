'use client';

import { motion } from 'framer-motion';

type OrbState = 'idle' | 'listening' | 'thinking' | 'speaking';

interface OrbAvatarProps {
  state: OrbState;
}

export default function OrbAvatar({ state }: OrbAvatarProps) {
  return (
    <div className="relative flex items-center justify-center" style={{ width: 200, height: 200 }}>
      {/* Outer pulse - active states */}
      {(state === 'speaking' || state === 'listening') && (
        <motion.div
          className="absolute rounded-full border border-amber-300/30"
          style={{ width: 180, height: 180 }}
          animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}

      {/* Ring */}
      <motion.div
        className="absolute rounded-full border border-amber-400/15"
        style={{ width: 170, height: 170, borderStyle: 'dashed' }}
        animate={{ rotate: 360 }}
        transition={{ duration: state === 'listening' ? 3 : state === 'speaking' ? 6 : 15, repeat: Infinity, ease: 'linear' }}
      />

      {/* Main orb */}
      <motion.div
        className="rounded-full"
        style={{ width: 130, height: 130 }}
        animate={{
          scale: state === 'speaking' ? [1, 1.12, 0.95, 1.08, 1] :
                 state === 'listening' ? [1.02, 1.12, 1.02] :
                 state === 'thinking' ? [0.97, 1.04, 0.97] :
                 [0.98, 1.02, 0.98],
          background: state === 'speaking' ? 'radial-gradient(circle, #fde68a, #f59e0b, #b45309)' :
                      state === 'listening' ? 'radial-gradient(circle, #fbbf24, #d97706, #92400e)' :
                      state === 'thinking' ? 'radial-gradient(circle, #a3e635, #65a30d, #365314)' :
                      'radial-gradient(circle, #fcd34d, #d97706, #78350f)',
          boxShadow: state === 'speaking' ? '0 0 60px rgba(251,191,36,0.5), 0 0 120px rgba(245,158,11,0.2)' :
                     state === 'listening' ? '0 0 50px rgba(251,191,36,0.4)' :
                     state === 'thinking' ? '0 0 40px rgba(163,230,53,0.3)' :
                     '0 0 30px rgba(245,158,11,0.15)',
        }}
        transition={{
          scale: { duration: state === 'speaking' ? 0.8 : state === 'thinking' ? 0.5 : 3, repeat: Infinity, ease: 'easeInOut' },
          background: { duration: 0.5 },
          boxShadow: { duration: 0.5 },
        }}
      />

      {/* Label */}
      {(state === 'listening' || state === 'thinking') && (
        <motion.p
          className="absolute -bottom-6 font-display text-[10px] tracking-[0.15em] text-amber-600/60"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          {state === 'listening' ? 'ESCUCHANDO' : 'PROCESANDO'}
        </motion.p>
      )}
    </div>
  );
}
