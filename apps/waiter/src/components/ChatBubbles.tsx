'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

interface ChatBubblesProps {
  messages: Message[];
}

export default function ChatBubbles({ messages }: ChatBubblesProps) {
  const visibleMessages = messages.slice(-3);

  return (
    <div className="w-full max-w-md mx-auto px-4 space-y-2">
      <AnimatePresence mode="popLayout">
        {visibleMessages.map((msg) => (
          <motion.div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <div
              className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm font-body leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-accent-red/20 text-white/90 rounded-br-sm backdrop-blur-md border border-accent-red/20'
                  : 'bg-white/5 text-white/80 rounded-bl-sm backdrop-blur-md border border-white/10'
              }`}
              style={{ whiteSpace: 'pre-line' }}
            >
              {msg.content}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
