'use client';

import { useState, useEffect } from 'react';
import { Clock, Check, ChefHat, CreditCard, ArrowRight } from 'lucide-react';
import { demoOrders, DemoOrder } from '@/lib/demoData';
import { supabase } from '@/lib/supabase';

type StatusFilter = 'todos' | 'pendiente' | 'preparando' | 'servido' | 'pagado';

const statusConfig: Record<string, { color: string; bg: string; icon: React.ElementType; next: string | null }> = {
  pendiente: { color: 'text-yellow-400', bg: 'bg-yellow-500/20', icon: Clock, next: 'preparando' },
  preparando: { color: 'text-blue-400', bg: 'bg-blue-500/20', icon: ChefHat, next: 'servido' },
  servido: { color: 'text-green-400', bg: 'bg-green-500/20', icon: Check, next: 'pagado' },
  pagado: { color: 'text-gray-400', bg: 'bg-gray-500/20', icon: CreditCard, next: null },
};

const filterTabs: { value: StatusFilter; label: string }[] = [
  { value: 'todos', label: 'Todos' },
  { value: 'pendiente', label: 'Pendientes' },
  { value: 'preparando', label: 'Preparando' },
  { value: 'servido', label: 'Servidos' },
  { value: 'pagado', label: 'Pagados' },
];

export default function OrdersPage() {
  const [orders, setOrders] = useState<DemoOrder[]>(demoOrders);
  const [filter, setFilter] = useState<StatusFilter>('todos');
  const [toast, setToast] = useState('');

  // Subscribe to realtime changes if supabase is configured
  useEffect(() => {
    if (!supabase) return;

    const channel = supabase
      .channel('orders-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, (payload) => {
        console.log('Order change received:', payload);
      })
      .subscribe();

    return () => {
      supabase?.removeChannel(channel);
    };
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  };

  const advanceStatus = (orderId: string) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id !== orderId) return order;
        const config = statusConfig[order.status];
        if (!config.next) return order;
        return { ...order, status: config.next as DemoOrder['status'] };
      })
    );
    showToast('Estado actualizado');
  };

  const filteredOrders =
    filter === 'todos' ? orders : orders.filter((o) => o.status === filter);

  const countByStatus = (status: string) =>
    orders.filter((o) => o.status === status).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Pedidos</h1>
        <div className="text-sm text-gray-400">
          {orders.length} pedidos totales
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {filterTabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setFilter(tab.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors relative
              ${filter === tab.value
                ? 'bg-[#E94560] text-white'
                : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
              }`}
          >
            {tab.label}
            {tab.value !== 'todos' && (
              <span className={`ml-1.5 text-xs ${filter === tab.value ? 'text-white/70' : 'text-gray-500'}`}>
                ({countByStatus(tab.value)})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Orders List */}
      <div className="space-y-3">
        {filteredOrders.map((order) => {
          const config = statusConfig[order.status];
          const StatusIcon = config.icon;

          return (
            <div
              key={order.id}
              className="bg-[#1a1a2e] border border-white/10 rounded-xl p-5"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#E94560]/20 flex items-center justify-center">
                    <span className="text-sm font-bold text-[#E94560]">M{order.table_number}</span>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">
                      Mesa {order.table_number}
                    </h3>
                    <p className="text-xs text-gray-500">{order.time} - {order.id}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full ${config.bg} ${config.color}`}>
                    <StatusIcon className="w-3.5 h-3.5" />
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>
              </div>

              {/* Items */}
              <div className="space-y-1 mb-3">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-sm">
                    <span className="text-gray-300">
                      {item.quantity}x {item.name}
                    </span>
                    <span className="text-gray-500">{(item.price * item.quantity).toFixed(2)} EUR</span>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-3 border-t border-white/5">
                <span className="text-lg font-bold text-white">{order.total.toFixed(2)} EUR</span>

                {config.next && (
                  <button
                    onClick={() => advanceStatus(order.id)}
                    className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                  >
                    <span>
                      {config.next === 'preparando' && 'Preparar'}
                      {config.next === 'servido' && 'Marcar servido'}
                      {config.next === 'pagado' && 'Marcar pagado'}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredOrders.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No hay pedidos con este filtro</p>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 bg-green-500/20 border border-green-500/30 text-green-400 px-4 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 z-50">
          <Check className="w-4 h-4" />
          {toast}
        </div>
      )}
    </div>
  );
}
