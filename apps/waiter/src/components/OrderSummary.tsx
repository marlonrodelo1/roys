'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, X, Check, Minus, Plus } from 'lucide-react';
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

          {/* Bottom sheet */}
          <motion.div
            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 shadow-2xl max-h-[70dvh] flex flex-col"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          >
            {/* Handle bar */}
            <div className="flex justify-center py-2">
              <div className="w-10 h-1 rounded-full bg-gray-300" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 pb-3">
              <div className="flex items-center gap-2">
                <ShoppingBag size={18} className="text-amber-500" />
                <h2 className="font-body font-semibold text-gray-800">Tu Pedido</h2>
              </div>
              <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 active:scale-95">
                <X size={16} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-5 space-y-2">
              {items.map((item, index) => (
                <motion.div
                  key={item.menuItemId}
                  className="flex justify-between items-center bg-gray-50 rounded-xl p-3"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">{item.name}</p>
                    <p className="text-xs text-gray-400">{item.quantity} × {item.price.toFixed(2)}€</p>
                  </div>
                  <p className="text-sm font-semibold text-amber-600">
                    {(item.price * item.quantity).toFixed(2)}€
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Footer */}
            <div className="px-5 py-4 border-t border-gray-100 space-y-3" style={{ paddingBottom: 'calc(1rem + env(safe-area-inset-bottom))' }}>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Total</span>
                <span className="text-xl font-bold text-gray-800">{total.toFixed(2)}€</span>
              </div>
              <button
                onClick={onConfirm}
                className="w-full py-3.5 rounded-2xl bg-amber-500 text-white font-body font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-200 active:scale-[0.98] transition-transform"
              >
                <Check size={18} />
                Confirmar Pedido
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
