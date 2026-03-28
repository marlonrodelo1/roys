import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ROYS Dashboard',
  description: 'Panel de gestión de tu restaurante con ROYS.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
