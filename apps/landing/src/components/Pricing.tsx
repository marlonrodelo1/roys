'use client';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface Plan {
  name: string;
  price: string;
  period: string;
  features: string[];
  highlighted: boolean;
  badge?: string;
  cta: string;
}

const plans: Plan[] = [
  {
    name: 'Starter',
    price: '49\u20AC',
    period: '/mes',
    features: [
      'Hasta 10 mesas',
      '1 restaurante',
      'Bot basico',
      'Email soporte',
    ],
    highlighted: false,
    cta: 'Empezar',
  },
  {
    name: 'Professional',
    price: '99\u20AC',
    period: '/mes',
    features: [
      'Hasta 30 mesas',
      '3 restaurantes',
      'Bot personalizado',
      'Dashboard avanzado',
      'Soporte prioritario',
    ],
    highlighted: true,
    badge: 'Mas popular',
    cta: 'Elegir Professional',
  },
  {
    name: 'Enterprise',
    price: 'Personalizado',
    period: '',
    features: [
      'Mesas ilimitadas',
      'Restaurantes ilimitados',
      'IA personalizada',
      'API access',
      'Soporte dedicado 24/7',
    ],
    highlighted: false,
    cta: 'Contactar',
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 },
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

export default function Pricing() {
  return (
    <section id="pricing" className="py-24 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(233,69,96,0.04)_0%,transparent_60%)]" />

      <div className="relative max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-4xl md:text-5xl font-bold text-text-primary">
            Planes y Precios
          </h2>
          <p className="mt-4 text-text-secondary text-lg max-w-2xl mx-auto font-body">
            Elige el plan que mejor se adapte a tu negocio
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="flex flex-col lg:flex-row items-center lg:items-stretch justify-center gap-6"
        >
          {plans.map((plan) => (
            <motion.div
              key={plan.name}
              variants={cardVariants}
              className={`relative w-full max-w-sm rounded-2xl p-8 backdrop-blur-lg border transition-all duration-300 ${
                plan.highlighted
                  ? 'bg-white/[0.08] border-accent-red/40 scale-100 lg:scale-105'
                  : 'bg-white/5 border-white/10 hover:bg-white/[0.07] hover:border-white/20'
              }`}
              style={
                plan.highlighted
                  ? {
                      boxShadow:
                        '0 0 40px rgba(233,69,96,0.15), 0 0 80px rgba(233,69,96,0.05)',
                    }
                  : undefined
              }
            >
              {/* Badge */}
              {plan.badge && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-accent-red text-white text-xs font-bold font-display tracking-wide">
                  {plan.badge}
                </span>
              )}

              {/* Plan name */}
              <h3 className="font-display text-xl font-semibold text-text-primary">
                {plan.name}
              </h3>

              {/* Price */}
              <div className="mt-4 mb-6">
                <span className="font-display text-4xl font-bold text-text-primary">
                  {plan.price}
                </span>
                {plan.period && (
                  <span className="text-text-secondary text-sm font-body">
                    {plan.period}
                  </span>
                )}
              </div>

              {/* Divider */}
              <div className="h-px bg-white/10 mb-6" />

              {/* Features */}
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-3 text-sm font-body text-text-secondary"
                  >
                    <Check className="w-4 h-4 text-accent-green flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <button
                className={`w-full py-3 rounded-xl font-semibold font-body text-sm transition-all duration-300 ${
                  plan.highlighted
                    ? 'bg-accent-red text-white hover:shadow-lg hover:shadow-accent-red/30 hover:scale-[1.02]'
                    : 'bg-white/10 text-text-primary hover:bg-white/15 border border-white/10 hover:border-white/20'
                }`}
              >
                {plan.cta}
              </button>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
