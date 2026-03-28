'use client';

import { motion } from 'framer-motion';
import { Mic, TrendingUp, Monitor, ShieldCheck, BarChart3, Globe } from 'lucide-react';

const features = [
  {
    icon: Mic,
    title: 'Conversacion Natural',
    description:
      'Tus clientes hablan con Roys como hablarian con un camarero real. Sin menus complicados.',
    color: '#E94560',
  },
  {
    icon: TrendingUp,
    title: 'Venta Activa Inteligente',
    description:
      'Roys sugiere maridajes, postres y especialidades. Aumenta el ticket medio sin esfuerzo.',
    color: '#00d4ff',
  },
  {
    icon: Monitor,
    title: 'Integracion con tu TPV',
    description:
      'Los pedidos van directamente a tu sistema de punto de venta. Sin intermediarios.',
    color: '#16C79A',
  },
  {
    icon: ShieldCheck,
    title: 'Control de Alergenos',
    description:
      'Informacion detallada de ingredientes y alergenos de cada plato. Seguridad para tus clientes.',
    color: '#E94560',
  },
  {
    icon: BarChart3,
    title: 'Dashboard en Tiempo Real',
    description:
      'Monitoriza pedidos, ventas y rendimiento desde un panel centralizado.',
    color: '#00d4ff',
  },
  {
    icon: Globe,
    title: 'Multi-idioma',
    description:
      'Roys habla el idioma de tus clientes. Espanol, ingles, frances, aleman e italiano.',
    color: '#16C79A',
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};

export default function Features() {
  return (
    <section id="features" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-4xl md:text-5xl font-bold text-text-primary">
            Todo lo que necesitas
          </h2>
          <p className="mt-4 text-text-secondary text-lg max-w-2xl mx-auto font-body">
            Una plataforma completa para transformar la experiencia de tu restaurante
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={cardVariants}
              className="group relative p-6 rounded-2xl backdrop-blur-lg bg-white/5 border border-white/10 transition-all duration-300 hover:bg-white/[0.08] hover:border-white/20"
              style={{
                boxShadow: `0 0 0 transparent`,
              }}
              whileHover={{
                boxShadow: `0 0 30px ${feature.color}15, 0 0 60px ${feature.color}08`,
              }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                style={{ backgroundColor: `${feature.color}15` }}
              >
                <feature.icon
                  className="w-6 h-6"
                  style={{ color: feature.color }}
                />
              </div>
              <h3 className="font-display text-lg font-semibold text-text-primary mb-2">
                {feature.title}
              </h3>
              <p className="text-text-secondary font-body text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
