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
          <motion.div
            className="fixed inset-0 bg-black/20 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            className="fixed right-0 top-0 bottom-0 w-full max-w-sm bg-white border-l border-gray-200 z-50 flex flex-col shadow-2xl"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <ShoppingBag size={20} className="text-amber-500" />
                <h2 className="font-display text-lg tracking-wide text-gray-800">Tu Pedido</h2>
              </div>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              <AnimatePresence>
                {items.map((item, index) => (
                  <motion.div
                    key={item.menuItemId}
                    className="flex justify-between items-center bg-amber-50 rounded-xl p-3 border border-amber-100"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-800">{item.name}</p>
                      <p className="text-xs text-gray-500">{item.quantity}x {item.price.toFixed(2)}€</p>
                    </div>
                    <p className="text-sm font-semibold text-amber-600">
                      {(item.price * item.quantity).toFixed(2)}€
                    </p>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <div className="p-4 border-t border-gray-100 space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-display text-sm tracking-wider text-gray-400">TOTAL</span>
                <span className="font-display text-2xl text-amber-600">{total.toFixed(2)}€</span>
              </div>

              <motion.button
                onClick={onConfirm}
                className="w-full py-4 rounded-xl bg-amber-500 text-white font-display tracking-wider flex items-center justify-center gap-2 shadow-lg"
                whileHover={{ scale: 1.02 }}
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
