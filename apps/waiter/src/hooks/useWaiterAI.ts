'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import type { MenuItem, MenuCategory, Restaurant } from '@roys/shared/types';
import { processMockMessage, type DetectedItem } from '../lib/mockAI';
import { sendToOpenClaw, checkOpenClawHealth, type OpenClawMessage } from '../lib/openclawClient';
import { supabase } from '../lib/supabase';

export type OrbState = 'idle' | 'listening' | 'thinking' | 'speaking';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

interface UseWaiterAIReturn {
  messages: Message[];
  currentOrder: DetectedItem[];
  orbState: OrbState;
  sendMessage: (text: string) => Promise<string>;
  confirmOrder: () => Promise<boolean>;
  resetConversation: () => void;
  setOrbState: (state: OrbState) => void;
  orderTotal: number;
  isConnectedToOpenClaw: boolean;
}

export function useWaiterAI(
  restaurant: Restaurant,
  categories: MenuCategory[],
  menuItems: MenuItem[],
  tableNumber: number,
  sessionId?: string
): UseWaiterAIReturn {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentOrder, setCurrentOrder] = useState<DetectedItem[]>([]);
  const [orbState, setOrbState] = useState<OrbState>('idle');
  const [isConnectedToOpenClaw, setIsConnectedToOpenClaw] = useState(false);
  const historyRef = useRef<{ role: 'user' | 'assistant'; content: string }[]>([]);

  const orderTotal = currentOrder.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Check OpenClaw health on mount and periodically
  useEffect(() => {
    let mounted = true;

    const check = async () => {
      const healthy = await checkOpenClawHealth();
      if (mounted) setIsConnectedToOpenClaw(healthy);
    };

    check();
    const interval = setInterval(check, 30000); // re-check every 30s

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  const saveMessageToSupabase = useCallback(async (role: 'user' | 'assistant', content: string, type: string = 'text') => {
    if (!supabase || !sessionId) return;
    try {
      await supabase.from('conversation_messages').insert({
        session_id: sessionId,
        role,
        content,
        message_type: type,
      });
    } catch { /* silently fail in demo mode */ }
  }, [sessionId]);

  /**
   * Build the system prompt for OpenClaw with restaurant context.
   */
  const buildSystemPrompt = useCallback((): string => {
    const menuText = categories
      .filter(c => c.is_active)
      .sort((a, b) => a.sort_order - b.sort_order)
      .map(cat => {
        const items = menuItems
          .filter(i => i.category_id === cat.id && i.is_available)
          .sort((a, b) => a.sort_order - b.sort_order)
          .map(i => {
            let line = `- ${i.name}: ${i.price.toFixed(2)}€`;
            if (i.description) line += ` (${i.description})`;
            if (i.allergens.length > 0) line += ` [Alérgenos: ${i.allergens.join(', ')}]`;
            if (i.pairing_suggestion) line += ` Maridaje: ${i.pairing_suggestion}`;
            if (i.chef_note) line += ` Chef: ${i.chef_note}`;
            return line;
          })
          .join('\n');
        return `## ${cat.name}\n${items}`;
      })
      .join('\n\n');

    const orderText = currentOrder.length > 0
      ? `\n\nPEDIDO ACTUAL:\n${currentOrder.map(i => `- ${i.quantity}x ${i.name} (${(i.price * i.quantity).toFixed(2)}€)`).join('\n')}\nTotal: ${orderTotal.toFixed(2)}€`
      : '';

    return `Eres ${restaurant.bot_name || 'Roys'}, un camarero IA del restaurante "${restaurant.name}". Tu tono es ${restaurant.bot_tone === 'friendly' ? 'cercano y amigable' : restaurant.bot_tone === 'formal' ? 'formal y elegante' : 'divertido y casual'}. Hablas en ${restaurant.bot_language === 'es' ? 'español' : restaurant.bot_language}.

MENÚ DEL RESTAURANTE:
${menuText}${orderText}

INSTRUCCIONES:
- Saluda al cliente y ofrece la carta.
- Cuando el cliente pida un plato, confírmalo y sugiere maridaje si existe.
- Informa de alérgenos cuando sea relevante.
- Cuando el cliente diga que no quiere nada más, resume el pedido con precios y total.
- Sé conciso y natural, como un camarero real.
- Responde SOLO con texto, sin markdown ni formateo especial.`;
  }, [restaurant, categories, menuItems, currentOrder, orderTotal]);

  /**
   * Intenta enviar a OpenClaw. Si falla, usa mock como fallback.
   */
  const getAIResponse = useCallback(async (text: string): Promise<string> => {
    // Try OpenClaw first if connected
    if (isConnectedToOpenClaw) {
      try {
        const openclawMessages: OpenClawMessage[] = [
          { role: 'system', content: buildSystemPrompt() },
          ...historyRef.current.map(m => ({
            role: m.role as 'user' | 'assistant',
            content: m.content,
          })),
          { role: 'user' as const, content: text },
        ];

        const sessionKey = sessionId || `table-${tableNumber}`;
        const response = await sendToOpenClaw(openclawMessages, tableNumber, sessionKey);
        return response;
      } catch (error) {
        console.warn('OpenClaw failed, falling back to mock:', error);
        setIsConnectedToOpenClaw(false);
        // Schedule a re-check in 10s
        setTimeout(async () => {
          const healthy = await checkOpenClawHealth();
          setIsConnectedToOpenClaw(healthy);
        }, 10000);
      }
    }

    // Fallback: mock IA
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 700));
    const response = processMockMessage(text, {
      restaurant,
      categories,
      menuItems,
      currentOrder,
      history: historyRef.current,
    });
    return response.text;
  }, [isConnectedToOpenClaw, buildSystemPrompt, sessionId, tableNumber, restaurant, categories, menuItems, currentOrder]);

  const sendMessage = useCallback(async (text: string): Promise<string> => {
    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMsg]);
    historyRef.current.push({ role: 'user', content: text });
    setOrbState('thinking');

    saveMessageToSupabase('user', text, 'voice');

    const responseText = await getAIResponse(text);

    // Try to detect menu items from the response (for mock fallback order tracking)
    if (!isConnectedToOpenClaw) {
      const mockResponse = processMockMessage(text, {
        restaurant, categories, menuItems, currentOrder,
        history: historyRef.current,
      });
      if (mockResponse.detectedItems) {
        setCurrentOrder(prev => {
          const newOrder = [...prev];
          for (const item of mockResponse.detectedItems!) {
            const existingIndex = newOrder.findIndex(o => o.menuItemId === item.menuItemId);
            if (existingIndex >= 0) {
              newOrder[existingIndex] = {
                ...newOrder[existingIndex],
                quantity: newOrder[existingIndex].quantity + item.quantity,
              };
            } else {
              newOrder.push(item);
            }
          }
          return newOrder;
        });
      }
    }

    const assistantMsg: Message = {
      id: `assistant-${Date.now()}`,
      role: 'assistant',
      content: responseText,
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, assistantMsg]);
    historyRef.current.push({ role: 'assistant', content: responseText });
    setOrbState('speaking');

    saveMessageToSupabase('assistant', responseText, 'text');

    return responseText;
  }, [restaurant, categories, menuItems, currentOrder, saveMessageToSupabase, getAIResponse, isConnectedToOpenClaw]);

  const confirmOrder = useCallback(async (): Promise<boolean> => {
    if (currentOrder.length === 0) return false;

    if (supabase && sessionId) {
      try {
        const { data: order } = await supabase.from('orders').insert({
          session_id: sessionId,
          restaurant_id: restaurant.id,
          status: 'pending',
          total: orderTotal,
        }).select().single();

        if (order) {
          const orderItems = currentOrder.map(item => ({
            order_id: order.id,
            menu_item_id: item.menuItemId,
            item_name: item.name,
            item_price: item.price,
            quantity: item.quantity,
            notes: item.notes || null,
          }));
          await supabase.from('order_items').insert(orderItems);
        }
      } catch { /* silently fail in demo */ }
    }

    setCurrentOrder([]);
    return true;
  }, [currentOrder, orderTotal, restaurant.id, sessionId]);

  const resetConversation = useCallback(() => {
    setMessages([]);
    setCurrentOrder([]);
    setOrbState('idle');
    historyRef.current = [];
  }, []);

  return {
    messages,
    currentOrder,
    orbState,
    sendMessage,
    confirmOrder,
    resetConversation,
    setOrbState,
    orderTotal,
    isConnectedToOpenClaw,
  };
}
