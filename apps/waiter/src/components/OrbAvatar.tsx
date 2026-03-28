'use client';

import { motion, AnimatePresence } from 'framer-motion';

type OrbState = 'idle' | 'listening' | 'thinking' | 'speaking';

const stateConfig = {
  idle: {
    innerGradient: 'radial-gradient(circle, #f59e0b, #d97706, #92400e)',
    outerGlow: '0 0 80px rgba(245, 158, 11, 0.3), 0 0 160px rgba(245, 158, 11, 0.1)',
    scale: [0.95, 1.03, 0.95],
    ringSpeed: 20,
    label: '',
    labelColor: '',
  },
  listening: {
    innerGradient: 'radial-gradient(circle, #fbbf24, #f59e0b, #d97706)',
    outerGlow: '0 0 100px rgba(251, 191, 36, 0.5), 0 0 200px rgba(251, 191, 36, 0.2)',
    scale: [1.08, 1.18, 1.08],
    ringSpeed: 3,
    label: 'ESCUCHANDO...',
    labelColor: '#d97706',
  },
  thinking: {
    innerGradient: 'radial-gradient(circle, #a3e635, #65a30d, #4d7c0f)',
    outerGlow: '0 0 80px rgba(163, 230, 53, 0.4), 0 0 150px rgba(163, 230, 53, 0.15)',
    scale: [0.97, 1.05, 0.97],
    ringSpeed: 2,
    label: 'PROCESANDO...',
    labelColor: '#65a30d',
  },
  speaking: {
    innerGradient: 'radial-gradient(circle, #fde68a, #fbbf24, #f59e0b)',
    outerGlow: '0 0 120px rgba(253, 230, 138, 0.6), 0 0 250px rgba(251, 191, 36, 0.3)',
    scale: [1.0, 1.1, 1.0],
    ringSpeed: 8,
    label: '',
    labelColor: '',
  },
};

interface OrbAvatarProps {
  state: OrbState;
}

export default function OrbAvatar({ state }: OrbAvatarProps) {
  const config = stateConfig[state];

  // Generate orbital ring configurations
  const rings = [
    { size: 220, border: 'border-amber-400/20', style: 'dashed', speed: config.ringSpeed, direction: 1 },
    { size: 260, border: 'border-amber-300/15', style: 'dotted', speed: config.ringSpeed * 1.3, direction: -1 },
    { size: 300, border: 'border-amber-500/10', style: 'dashed', speed: config.ringSpeed * 1.7, direction: 1 },
    { size: 340, border: 'border-amber-400/8', style: 'solid', speed: config.ringSpeed * 2.2, direction: -1 },
    { size: 370, border: 'border-amber-300/5', style: 'dashed', speed: config.ringSpeed * 2.8, direction: 1 },
  ];

  return (
    <div className="relative flex items-center justify-center" style={{ width: 400, height: 400 }}>
      {/* Ambient glow */}
      <motion.div
        className="absolute rounded-full"
        style={{ width: 200, height: 200 }}
        animate={{
          boxShadow: config.outerGlow,
        }}
        transition={{ duration: 0.8 }}
      />

      {/* Orbital rings */}
      {rings.map((ring, i) => (
        <motion.div
          key={i}
          className={`absolute rounded-full border ${ring.border}`}
          style={{
            width: ring.size,
            height: ring.size,
            borderStyle: ring.style,
          }}
          animate={{ rotate: 360 * ring.direction }}
          transition={{ duration: ring.speed, repeat: Infinity, ease: 'linear' }}
        />
      ))}

      {/* Orbiting dots */}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <motion.div
          key={`dot-${i}`}
          className="absolute w-1.5 h-1.5 rounded-full bg-amber-400"
          style={{
            boxShadow: '0 0 6px rgba(245, 158, 11, 0.8)',
          }}
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: config.ringSpeed * (1 + i * 0.4),
            repeat: Infinity,
            ease: 'linear',
            delay: i * 0.5,
          }}
          initial={false}
        >
          <motion.div
            className="absolute w-1.5 h-1.5 rounded-full bg-amber-400"
            style={{
              transform: `translateX(${110 + i * 20}px)`,
              boxShadow: '0 0 8px rgba(251, 191, 36, 0.9)',
            }}
          />
        </motion.div>
      ))}

      {/* Inner sphere */}
      <motion.div
        className="relative rounded-full flex items-center justify-center"
        style={{ width: 180, height: 180 }}
        animate={{
          background: config.innerGradient,
          scale: config.scale,
          boxShadow: config.outerGlow,
        }}
        transition={{
          background: { duration: 0.6 },
          scale: { duration: state === 'thinking' ? 0.6 : 3, repeat: Infinity, ease: 'easeInOut' },
          boxShadow: { duration: 0.6 },
        }}
      >
        {/* Glass overlay */}
        <div className="absolute inset-3 rounded-full bg-white/10 backdrop-blur-sm" />

        {/* Inner bright core */}
        <motion.div
          className="absolute w-20 h-20 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.6), rgba(251,191,36,0.3), transparent)' }}
          animate={{ opacity: [0.4, 0.8, 0.4], scale: [0.9, 1.1, 0.9] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Center point */}
        <motion.div
          className="w-3 h-3 rounded-full bg-white/60"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      </motion.div>

      {/* State label */}
      <AnimatePresence>
        {config.label && (
          <motion.div
            className="absolute -bottom-4 font-display text-xs tracking-[0.3em]"
            style={{ color: config.labelColor }}
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
