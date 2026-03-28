'use client';

import { motion } from 'framer-motion';
import { useMemo } from 'react';

type OrbState = 'idle' | 'listening' | 'thinking' | 'speaking';

interface WaveVisualizerProps {
  state: OrbState;
}

export default function WaveVisualizer({ state }: WaveVisualizerProps) {
  const waveConfig = useMemo(() => {
    switch (state) {
      case 'listening':
        return { amplitude: 15, frequency: 3, color: '#E94560', opacity: 0.6, speed: 1.5 };
      case 'speaking':
        return { amplitude: 12, frequency: 4, color: '#00d4ff', opacity: 0.5, speed: 2 };
      case 'thinking':
        return { amplitude: 5, frequency: 6, color: '#16C79A', opacity: 0.3, speed: 3 };
      default:
        return { amplitude: 3, frequency: 2, color: '#1a1a3e', opacity: 0.15, speed: 0.5 };
    }
  }, [state]);

  const generateWavePath = (offset: number, amp: number) => {
    const points: string[] = [];
    const width = 400;
    const centerY = 50;

    for (let x = 0; x <= width; x += 2) {
      const y = centerY + Math.sin((x / width) * Math.PI * waveConfig.frequency + offset) * amp;
      points.push(`${x},${y}`);
    }

    return `M${points.join(' L')}`;
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <svg width="400" height="100" viewBox="0 0 400 100" className="opacity-80">
        {[0, 1, 2].map((i) => (
          <motion.path
            key={i}
            d={generateWavePath(i * 2, waveConfig.amplitude * (1 - i * 0.2))}
            fill="none"
            stroke={waveConfig.color}
            strokeWidth={1.5 - i * 0.3}
            opacity={waveConfig.opacity - i * 0.1}
            animate={{
              d: [
                generateWavePath(i * 2, waveConfig.amplitude * (1 - i * 0.2)),
                generateWavePath(i * 2 + Math.PI, waveConfig.amplitude * (1 - i * 0.2)),
                generateWavePath(i * 2 + Math.PI * 2, waveConfig.amplitude * (1 - i * 0.2)),
              ],
            }}
            transition={{
              duration: waveConfig.speed + i * 0.3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </svg>
    </div>
  );
}
