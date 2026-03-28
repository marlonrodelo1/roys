'use client';

import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(233,69,96,0.08)_0%,transparent_50%),radial-gradient(ellipse_at_bottom_left,rgba(0,212,255,0.06)_0%,transparent_50%)]" />

      <div className="relative max-w-7xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center pt-20">
        {/* Left: Copy */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <h1 className="font-display text-5xl md:text-7xl font-bold leading-tight bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent">
            El camarero IA que nunca descansa
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-6 text-lg md:text-xl text-text-secondary max-w-xl font-body leading-relaxed"
          >
            Inteligencia artificial conversacional en cada mesa de tu restaurante.
            Voz, recomendaciones, pedidos automaticos al TPV.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-10 flex flex-wrap gap-4"
          >
            <a
              href="#features"
              className="inline-flex items-center px-8 py-4 rounded-xl bg-accent-red text-white font-semibold font-body text-lg transition-all duration-300 hover:scale-105"
              style={{
                boxShadow:
                  '0 0 20px rgba(233,69,96,0.4), 0 0 60px rgba(233,69,96,0.15)',
              }}
            >
              Descubrir mas
            </a>
            <a
              href="#how-it-works"
              className="inline-flex items-center px-8 py-4 rounded-xl border border-white/20 text-text-primary font-semibold font-body text-lg transition-all duration-300 hover:bg-white/5 hover:border-white/30"
            >
              Como funciona
            </a>
          </motion.div>
        </motion.div>

        {/* Right: Animated Orb */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="hidden lg:flex items-center justify-center"
        >
          <div className="relative w-80 h-80">
            {/* Outer glow ring */}
            <div
              className="absolute inset-0 rounded-full animate-pulse"
              style={{
                background:
                  'radial-gradient(circle, rgba(233,69,96,0.15) 0%, transparent 70%)',
              }}
            />
            {/* Main orb */}
            <div
              className="absolute inset-8 rounded-full animate-[pulse_3s_ease-in-out_infinite]"
              style={{
                background:
                  'radial-gradient(circle at 30% 30%, rgba(0,212,255,0.4), rgba(233,69,96,0.5) 50%, rgba(22,199,154,0.3) 100%)',
                boxShadow:
                  '0 0 60px rgba(233,69,96,0.3), 0 0 120px rgba(0,212,255,0.15), inset 0 0 60px rgba(255,255,255,0.05)',
              }}
            />
            {/* Inner highlight */}
            <div
              className="absolute inset-16 rounded-full"
              style={{
                background:
                  'radial-gradient(circle at 40% 35%, rgba(255,255,255,0.15), transparent 60%)',
              }}
            />
            {/* Rotating ring */}
            <div
              className="absolute inset-4 rounded-full border border-white/10 animate-[spin_20s_linear_infinite]"
            />
            <div
              className="absolute inset-12 rounded-full border border-accent-cyan/10 animate-[spin_15s_linear_infinite_reverse]"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
