'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const navLinks = [
  { label: 'Producto', href: '#features' },
  { label: 'Como Funciona', href: '#how-it-works' },
  { label: 'Arquitectura', href: '#architecture' },
  { label: 'Precios', href: '#pricing' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'backdrop-blur-lg bg-bg-primary/70 border-b border-white/10 shadow-lg shadow-black/20'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <a
          href="#hero"
          className="font-display text-2xl font-bold text-accent-red tracking-wider"
          style={{ textShadow: '0 0 20px rgba(233,69,96,0.6), 0 0 40px rgba(233,69,96,0.3)' }}
        >
          ROYS
        </a>

        {/* Nav links - hidden on mobile */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-text-secondary hover:text-text-primary transition-colors duration-200 font-body"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* CTA */}
        <a
          href="http://localhost:3001"
          className="px-5 py-2 rounded-lg bg-accent-red text-white text-sm font-semibold font-body transition-all duration-300 hover:shadow-lg hover:shadow-accent-red/30 hover:scale-105"
        >
          Acceder
        </a>
      </div>
    </motion.nav>
  );
}
