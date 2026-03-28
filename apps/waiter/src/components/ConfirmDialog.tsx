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
          <div className="absolute inset-0 bg-black/20" onClick={onClose} />

          <motion.div
            className="relative bg-white border border-gray-200 rounded-2xl p-6 max-w-sm w-full shadow-2xl"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
          >
            {!confirmed ? (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center">
                  <Sparkles size={28} className="text-amber-500" />
                </div>
                <h3 className="font-display text-xl tracking-wide text-gray-800">Confirmar Pedido</h3>
                <p className="text-sm text-gray-500">
                  {itemCount} {itemCount === 1 ? 'articulo' : 'articulos'} — Total: <span className="text-amber-600 font-semibold">{total.toFixed(2)}€</span>
                </p>
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={onClose}
                    className="flex-1 py-3 rounded-xl bg-gray-100 border border-gray-200 text-gray-500 font-body text-sm"
                  >
                    Cancelar
                  </button>
                  <motion.button
                    onClick={handleConfirm}
                    className="flex-1 py-3 rounded-xl bg-amber-500 text-white font-display text-sm tracking-wider shadow-md"
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
                  className="w-20 h-20 mx-auto rounded-full bg-green-50 border-2 border-green-500 flex items-center justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.2, 1] }}
                  transition={{ duration: 0.5 }}
                >
                  <Check size={36} className="text-green-500" />
                </motion.div>
                <h3 className="font-display text-xl tracking-wide text-green-600">Pedido Confirmado!</h3>
                <p className="text-sm text-gray-500">Tu pedido llegara en breve</p>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
