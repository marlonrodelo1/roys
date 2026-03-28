'use client';

import { motion } from 'framer-motion';
import { QrCode, MessageSquare, Sparkles, Check } from 'lucide-react';

const steps = [
  {
    icon: QrCode,
    title: 'Escanea el QR',
    description: 'El cliente escanea el codigo QR de su mesa con su movil',
    color: '#E94560',
  },
  {
    icon: MessageSquare,
    title: 'Habla con Roys',
    description:
      'Roys saluda y ofrece la carta. El cliente pide por voz naturalmente',
    color: '#00d4ff',
  },
  {
    icon: Sparkles,
    title: 'Roys sugiere y vende',
    description:
      'Sugerencias inteligentes de maridaje, postres y especialidades del dia',
    color: '#16C79A',
  },
  {
    icon: Check,
    title: 'Pedido al TPV',
    description:
      'El pedido se confirma y va directo al sistema del restaurante',
    color: '#E94560',
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.2 },
  },
};

const stepVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 relative">
      {/* Background accent */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,212,255,0.04)_0%,transparent_60%)]" />

      <div className="relative max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-4xl md:text-5xl font-bold text-text-primary">
            Como Funciona
          </h2>
          <p className="mt-4 text-text-secondary text-lg max-w-2xl mx-auto font-body">
            En solo 4 pasos, tus clientes disfrutan de una experiencia unica
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="relative grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-4"
        >
          {/* Connecting line - desktop: horizontal, mobile: vertical */}
          <div className="hidden md:block absolute top-14 left-[12.5%] right-[12.5%] h-px border-t-2 border-dashed border-white/10" />
          <div className="block md:hidden absolute top-0 bottom-0 left-8 w-px border-l-2 border-dashed border-white/10" />

          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              variants={stepVariants}
              className="relative flex md:flex-col items-start md:items-center text-left md:text-center gap-6 md:gap-0 pl-16 md:pl-0"
            >
              {/* Step number + icon */}
              <div className="relative z-10 flex-shrink-0 md:mb-6">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center backdrop-blur-lg bg-white/5 border border-white/10"
                  style={{
                    boxShadow: `0 0 25px ${step.color}20`,
                  }}
                >
                  <step.icon className="w-6 h-6" style={{ color: step.color }} />
                </div>
                <span
                  className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold font-display text-white"
                  style={{ backgroundColor: step.color }}
                >
                  {index + 1}
                </span>
              </div>

              <div>
                <h3 className="font-display text-lg font-semibold text-text-primary mb-2">
                  {step.title}
                </h3>
                <p className="text-text-secondary text-sm font-body leading-relaxed max-w-xs">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
