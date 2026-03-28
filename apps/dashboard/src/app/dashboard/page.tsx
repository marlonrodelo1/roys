'use client';

import { ShoppingCart, DollarSign, Receipt, Armchair } from 'lucide-react';
import StatsCard from '@/components/StatsCard';
import { demoOrders } from '@/lib/demoData';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const hourlyData = [
  { hour: '12:00', pedidos: 3 },
  { hour: '12:30', pedidos: 5 },
  { hour: '13:00', pedidos: 8 },
  { hour: '13:30', pedidos: 12 },
  { hour: '14:00', pedidos: 10 },
  { hour: '14:30', pedidos: 7 },
  { hour: '15:00', pedidos: 4 },
  { hour: '15:30', pedidos: 2 },
  { hour: '16:00', pedidos: 1 },
];

const statusColors: Record<string, string> = {
  pendiente: 'bg-yellow-500/20 text-yellow-400',
  preparando: 'bg-blue-500/20 text-blue-400',
  servido: 'bg-green-500/20 text-green-400',
  pagado: 'bg-gray-500/20 text-gray-400',
};

export default function OverviewPage() {
  const recentOrders = demoOrders.slice(0, 5);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Overview</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard icon={ShoppingCart} label="Pedidos hoy" value="24" trend="+12%" />
        <StatsCard icon={DollarSign} label="Ventas hoy" value="847.50 EUR" trend="+8%" />
        <StatsCard icon={Receipt} label="Ticket medio" value="35.31 EUR" />
        <StatsCard icon={Armchair} label="Mesas activas" value="5 / 8" />
      </div>

      {/* Chart */}
      <div className="bg-[#1a1a2e] border border-white/10 rounded-xl p-5">
        <h3 className="text-lg font-semibold text-white mb-4">Pedidos por hora</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={hourlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
              <XAxis
                dataKey="hour"
                stroke="#666"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#666"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1a1a2e',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  color: '#f0f0f0',
                }}
              />
              <Bar
                dataKey="pedidos"
                fill="#E94560"
                radius={[4, 4, 0, 0]}
                maxBarSize={40}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-[#1a1a2e] border border-white/10 rounded-xl p-5">
        <h3 className="text-lg font-semibold text-white mb-4">Últimos pedidos</h3>
        <div className="space-y-3">
          {recentOrders.map((order) => (
            <div
              key={order.id}
              className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-[#E94560]/20 flex items-center justify-center">
                  <span className="text-sm font-bold text-[#E94560]">M{order.table_number}</span>
                </div>
                <div>
                  <p className="text-sm text-white font-medium">
                    {order.items.map((i) => `${i.quantity}x ${i.name}`).join(', ').slice(0, 50)}
                    {order.items.map((i) => `${i.quantity}x ${i.name}`).join(', ').length > 50 ? '...' : ''}
                  </p>
                  <p className="text-xs text-gray-500">{order.time}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-white">{order.total.toFixed(2)} EUR</span>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${statusColors[order.status]}`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
