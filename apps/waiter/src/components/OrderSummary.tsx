'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, X, Check } from 'lucide-react';
import type { DetectedItem } from '../lib/mockAI';

interface OrderSummaryProps {
  items: DetectedItem[];
  total: number;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function OrderSummary({ items, total, isOpen, onClose, onConfirm }: OrderSummaryProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            className="fixed right-0 top-0 bottom-0 w-full max-w-sm bg-[#0a0a14]/95 backdrop-blur-xl border-l border-white/10 z-50 flex flex-col"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <ShoppingBag size={20} className="text-accent-cyan" />
                <h2 className="font-display text-lg tracking-wide">Tu Pedido</h2>
              </div>
              <button onClick={onClose} className="text-white/40 hover:text-white">
                <X size={20} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              <AnimatePresence>
                {items.map((item, index) => (
                  <motion.div
                    key={item.menuItemId}
                    className="flex justify-between items-center bg-white/5 rounded-xl p-3 border border-white/5"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div>
                      <p className="text-sm font-medium text-white/90">{item.name}</p>
                      <p className="text-xs text-white/40">{item.quantity}x {item.price.toFixed(2)}€</p>
                    </div>
                    <p className="text-sm font-semibold text-accent-cyan">
                      {(item.price * item.quantity).toFixed(2)}€
                    </p>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-white/10 space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-display text-sm tracking-wider text-white/60">TOTAL</span>
                <span className="font-display text-2xl text-accent-cyan">{total.toFixed(2)}€</span>
              </div>

              <motion.button
                onClick={onConfirm}
                className="w-full py-4 rounded-xl bg-accent-red/20 border border-accent-red/40 text-accent-red font-display tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(233,69,96,0.2)]"
                whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(233, 69, 96, 0.4)' }}
                whileTap={{ scale: 0.98 }}
              >
                <Check size={18} />
                CONFIRMAR PEDIDO
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
