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
                  ? 'bg-amber-500 text-white rounded-br-sm shadow-md'
                  : 'bg-gray-100 text-gray-800 rounded-bl-sm shadow-sm border border-gray-200'
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
