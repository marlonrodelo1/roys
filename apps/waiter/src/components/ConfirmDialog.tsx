'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Sparkles } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  total: number;
  itemCount: number;
}

export default function ConfirmDialog({ isOpen, onClose, onConfirm, total, itemCount }: ConfirmDialogProps) {
  const [confirmed, setConfirmed] = useState(false);

  const handleConfirm = async () => {
    await onConfirm();
    setConfirmed(true);
    setTimeout(() => {
      setConfirmed(false);
      onClose();
    }, 3000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

          {/* Dialog */}
          <motion.div
            className="relative bg-[#0a0a14]/95 backdrop-blur-xl border border-white/10 rounded-2xl p-6 max-w-sm w-full"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
          >
            {!confirmed ? (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-accent-red/10 border border-accent-red/30 flex items-center justify-center">
                  <Sparkles size={28} className="text-accent-red" />
                </div>
                <h3 className="font-display text-xl tracking-wide">Confirmar Pedido</h3>
                <p className="text-sm text-white/50">
                  {itemCount} {itemCount === 1 ? 'artículo' : 'artículos'} • Total: <span className="text-accent-cyan font-semibold">{total.toFixed(2)}€</span>
                </p>
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={onClose}
                    className="flex-1 py-3 rounded-xl bg-white/5 border border-white/10 text-white/60 font-body text-sm"
                  >
                    Cancelar
                  </button>
                  <motion.button
                    onClick={handleConfirm}
                    className="flex-1 py-3 rounded-xl bg-accent-red/20 border border-accent-red/40 text-accent-red font-display text-sm tracking-wider"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    CONFIRMAR
                  </motion.button>
                </div>
              </div>
            ) : (
              <motion.div
                className="text-center space-y-4 py-4"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <motion.div
                  className="w-20 h-20 mx-auto rounded-full bg-accent-green/20 border-2 border-accent-green flex items-center justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.2, 1] }}
                  transition={{ duration: 0.5 }}
                >
                  <Check size={36} className="text-accent-green" />
                </motion.div>
                <h3 className="font-display text-xl tracking-wide text-accent-green">¡Pedido Confirmado!</h3>
                <p className="text-sm text-white/50">Tu pedido llegará en breve</p>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
