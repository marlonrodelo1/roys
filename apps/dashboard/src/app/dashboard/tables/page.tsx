'use client';

import { useState, useCallback } from 'react';
import { Plus, QrCode, Download, X, Check, Wifi, WifiOff } from 'lucide-react';
import { demoTables, DemoTable, demoRestaurant } from '@/lib/demoData';

export default function TablesPage() {
  const [tables, setTables] = useState<DemoTable[]>(demoTables);
  const [showQrModal, setShowQrModal] = useState(false);
  const [selectedTable, setSelectedTable] = useState<DemoTable | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [loadingQr, setLoadingQr] = useState(false);
  const [toast, setToast] = useState('');

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  };

  const generateQr = useCallback(async (table: DemoTable) => {
    setSelectedTable(table);
    setShowQrModal(true);
    setLoadingQr(true);

    try {
      const QRCode = (await import('qrcode')).default;
      const url = `http://localhost:3002/${demoRestaurant.slug}/${table.table_number}`;
      const dataUrl = await QRCode.toDataURL(url, {
        width: 300,
        margin: 2,
        color: {
          dark: '#E94560',
          light: '#0a0a0f',
        },
      });
      setQrDataUrl(dataUrl);
    } catch {
      // Fallback: show a placeholder if qrcode library is not available
      setQrDataUrl('');
    } finally {
      setLoadingQr(false);
    }
  }, []);

  const downloadQr = () => {
    if (!qrDataUrl || !selectedTable) return;
    const link = document.createElement('a');
    link.download = `mesa-${selectedTable.table_number}-qr.png`;
    link.href = qrDataUrl;
    link.click();
  };

  const addTable = () => {
    const nextNumber = Math.max(...tables.map((t) => t.table_number), 0) + 1;
    const newTable: DemoTable = {
      id: `tbl-${nextNumber}`,
      table_number: nextNumber,
      is_active: false,
      current_session_id: null,
    };
    setTables((prev) => [...prev, newTable]);
    showToast(`Mesa ${nextNumber} añadida`);
  };

  const toggleTable = (id: string) => {
    setTables((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              is_active: !t.is_active,
              current_session_id: !t.is_active ? `sess-${Date.now()}` : null,
            }
          : t
      )
    );
  };

  const activeTables = tables.filter((t) => t.is_active).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Mesas & QR</h1>
          <p className="text-sm text-gray-400 mt-1">
            {activeTables} de {tables.length} mesas activas
          </p>
        </div>
        <button
          onClick={addTable}
          className="flex items-center gap-2 bg-[#E94560] hover:bg-[#E94560]/90 text-white font-medium px-4 py-2 rounded-lg text-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          Añadir Mesa
        </button>
      </div>

      {/* Tables Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {tables.map((table) => (
          <div
            key={table.id}
            className={`bg-[#1a1a2e] border-2 rounded-xl p-5 transition-all
              ${table.is_active
                ? 'border-green-500/50 shadow-lg shadow-green-500/5'
                : 'border-white/10'
              }`}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-2xl font-bold text-white">{table.table_number}</span>
              <div className="flex items-center gap-1">
                {table.is_active ? (
                  <Wifi className="w-4 h-4 text-green-400" />
                ) : (
                  <WifiOff className="w-4 h-4 text-gray-600" />
                )}
              </div>
            </div>

            <div className="flex items-center gap-1 mb-4">
              <div
                className={`w-2 h-2 rounded-full ${table.is_active ? 'bg-green-400' : 'bg-gray-600'}`}
              />
              <span className={`text-xs font-medium ${table.is_active ? 'text-green-400' : 'text-gray-500'}`}>
                {table.is_active ? 'Activa' : 'Inactiva'}
              </span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => generateQr(table)}
                className="flex-1 flex items-center justify-center gap-1.5 bg-[#00d4ff]/10 hover:bg-[#00d4ff]/20 text-[#00d4ff] text-xs font-medium py-2 rounded-lg transition-colors"
              >
                <QrCode className="w-3.5 h-3.5" />
                QR
              </button>
              <button
                onClick={() => toggleTable(table.id)}
                className={`flex-1 text-xs font-medium py-2 rounded-lg transition-colors
                  ${table.is_active
                    ? 'bg-red-500/10 hover:bg-red-500/20 text-red-400'
                    : 'bg-green-500/10 hover:bg-green-500/20 text-green-400'
                  }`}
              >
                {table.is_active ? 'Desactivar' : 'Activar'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 bg-green-500/20 border border-green-500/30 text-green-400 px-4 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 z-50">
          <Check className="w-4 h-4" />
          {toast}
        </div>
      )}

      {/* QR Modal */}
      {showQrModal && selectedTable && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-[#1a1a2e] border border-white/10 rounded-2xl w-full max-w-sm">
            <div className="flex items-center justify-between p-5 border-b border-white/10">
              <h3 className="text-lg font-semibold text-white">
                QR Mesa {selectedTable.table_number}
              </h3>
              <button
                onClick={() => setShowQrModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 flex flex-col items-center">
              {loadingQr ? (
                <div className="w-[300px] h-[300px] flex items-center justify-center">
                  <div className="w-8 h-8 border-2 border-[#E94560]/30 border-t-[#E94560] rounded-full animate-spin" />
                </div>
              ) : qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt={`QR Mesa ${selectedTable.table_number}`}
                  className="w-[300px] h-[300px] rounded-lg"
                />
              ) : (
                <div className="w-[300px] h-[300px] bg-white/5 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <QrCode className="w-16 h-16 text-gray-600 mx-auto mb-2" />
                    <p className="text-gray-500 text-sm">Instala el paquete qrcode</p>
                    <p className="text-gray-600 text-xs mt-1">npm install qrcode @types/qrcode</p>
                  </div>
                </div>
              )}

              <p className="text-xs text-gray-400 mt-3 text-center">
                URL: http://localhost:3002/{demoRestaurant.slug}/{selectedTable.table_number}
              </p>

              {qrDataUrl && (
                <button
                  onClick={downloadQr}
                  className="mt-4 w-full flex items-center justify-center gap-2 bg-[#E94560] hover:bg-[#E94560]/90 text-white font-medium py-2.5 rounded-lg text-sm transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Descargar QR
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
