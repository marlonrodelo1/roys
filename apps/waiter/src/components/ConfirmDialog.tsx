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
    setTimeout(() => { setConfirmed(false); onClose(); }, 2500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/25" onClick={onClose} />

          <motion.div
            className="relative bg-white rounded-2xl p-5 w-full max-w-sm shadow-2xl"
            initial={{ y: 50, scale: 0.95 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: 50, scale: 0.95 }}
            style={{ marginBottom: 'env(safe-area-inset-bottom)' }}
          >
            {!confirmed ? (
              <div className="text-center space-y-3">
                <div className="w-14 h-14 mx-auto rounded-full bg-amber-50 flex items-center justify-center">
                  <Sparkles size={24} className="text-amber-500" />
                </div>
                <h3 className="font-body font-semibold text-lg text-gray-800">Confirmar Pedido</h3>
                <p className="text-sm text-gray-500">
                  {itemCount} {itemCount === 1 ? 'artículo' : 'artículos'} · <span className="font-semibold text-gray-800">{total.toFixed(2)}€</span>
                </p>
                <div className="flex gap-2 pt-1">
                  <button onClick={onClose} className="flex-1 py-3 rounded-xl bg-gray-100 text-gray-500 text-sm font-body active:scale-[0.98]">
                    Cancelar
                  </button>
                  <button onClick={handleConfirm} className="flex-1 py-3 rounded-xl bg-amber-500 text-white text-sm font-body font-semibold shadow-md active:scale-[0.98]">
                    Confirmar
                  </button>
                </div>
              </div>
            ) : (
              <motion.div className="text-center space-y-3 py-2" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}>
                <motion.div
                  className="w-16 h-16 mx-auto rounded-full bg-green-50 border-2 border-green-500 flex items-center justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.2, 1] }}
                  transition={{ duration: 0.4 }}
                >
                  <Check size={32} className="text-green-500" />
                </motion.div>
                <h3 className="font-body font-semibold text-lg text-green-600">¡Pedido Confirmado!</h3>
                <p className="text-sm text-gray-500">Tu pedido llegará en breve</p>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
