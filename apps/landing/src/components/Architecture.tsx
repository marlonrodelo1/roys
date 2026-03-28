'use client';

import { motion } from 'framer-motion';
import { Smartphone, Bot, LayoutDashboard } from 'lucide-react';

const nodes = [
  {
    icon: Smartphone,
    label: 'Mesas',
    sublabel: 'QR + Voz',
    color: '#00d4ff',
  },
  {
    icon: Bot,
    label: 'Agente IA',
    sublabel: 'NLP + Logica',
    color: '#E94560',
  },
  {
    icon: LayoutDashboard,
    label: 'Dashboard',
    sublabel: 'TPV + Analytics',
    color: '#16C79A',
  },
];

const nodeVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};

export default function Architecture() {
  return (
    <section id="architecture" className="py-24 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(233,69,96,0.04)_0%,transparent_60%)]" />

      <div className="relative max-w-5xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="font-display text-4xl md:text-5xl font-bold text-text-primary">
            Arquitectura
          </h2>
          <p className="mt-4 text-text-secondary text-lg max-w-2xl mx-auto font-body">
            Una arquitectura moderna, escalable y en tiempo real
          </p>
        </motion.div>

        {/* Diagram */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-0"
        >
          {nodes.map((node, index) => (
            <div key={node.label} className="flex flex-col md:flex-row items-center">
              {/* Node card */}
              <motion.div
                variants={nodeVariants}
                transition={{ delay: index * 0.2 }}
                className="relative w-48 p-6 rounded-2xl backdrop-blur-lg bg-white/5 border border-white/10 text-center"
                style={{
                  boxShadow: `0 0 30px ${node.color}10, 0 0 60px ${node.color}05`,
                }}
              >
                <div
                  className="w-14 h-14 mx-auto rounded-xl flex items-center justify-center mb-4"
                  style={{ backgroundColor: `${node.color}15` }}
                >
                  <node.icon className="w-7 h-7" style={{ color: node.color }} />
                </div>
                <h3 className="font-display text-base font-semibold text-text-primary">
                  {node.label}
                </h3>
                <p className="text-text-secondary text-xs font-body mt-1">
                  {node.sublabel}
                </p>
              </motion.div>

              {/* Connector line */}
              {index < nodes.length - 1 && (
                <>
                  {/* Desktop: horizontal dashed line with arrow */}
                  <div className="hidden md:flex items-center w-20 mx-2">
                    <svg className="w-full h-6 overflow-visible" viewBox="0 0 80 24">
                      <line
                        x1="0"
                        y1="12"
                        x2="65"
                        y2="12"
                        stroke="rgba(255,255,255,0.2)"
                        strokeWidth="2"
                        strokeDasharray="6 4"
                      >
                        <animate
                          attributeName="stroke-dashoffset"
                          from="0"
                          to="-20"
                          dur="1.5s"
                          repeatCount="indefinite"
                        />
                      </line>
                      <polygon
                        points="65,6 80,12 65,18"
                        fill="rgba(255,255,255,0.2)"
                      />
                    </svg>
                  </div>
                  {/* Mobile: vertical dashed line with arrow */}
                  <div className="flex md:hidden items-center justify-center h-12 my-1">
                    <svg className="w-6 h-full overflow-visible" viewBox="0 0 24 48">
                      <line
                        x1="12"
                        y1="0"
                        x2="12"
                        y2="36"
                        stroke="rgba(255,255,255,0.2)"
                        strokeWidth="2"
                        strokeDasharray="6 4"
                      >
                        <animate
                          attributeName="stroke-dashoffset"
                          from="0"
                          to="-20"
                          dur="1.5s"
                          repeatCount="indefinite"
                        />
                      </line>
                      <polygon
                        points="6,36 12,48 18,36"
                        fill="rgba(255,255,255,0.2)"
                      />
                    </svg>
                  </div>
                </>
              )}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
