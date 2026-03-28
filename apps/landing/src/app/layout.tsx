import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ROYS — El Camarero IA',
  description: 'Inteligencia artificial conversacional en cada mesa de tu restaurante.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
