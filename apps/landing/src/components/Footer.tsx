'use client';

const footerColumns = [
  {
    title: 'Producto',
    links: [
      { label: 'Conversacion IA', href: '#features' },
      { label: 'Dashboard', href: '#features' },
      { label: 'Integraciones', href: '#features' },
      { label: 'Precios', href: '#pricing' },
    ],
  },
  {
    title: 'Empresa',
    links: [
      { label: 'About', href: '#' },
      { label: 'Blog', href: '#' },
      { label: 'Contacto', href: '#' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacidad', href: '#' },
      { label: 'Terminos', href: '#' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-bg-primary border-t border-white/10 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
          {/* Logo column */}
          <div className="col-span-2 md:col-span-1">
            <span
              className="font-display text-2xl font-bold text-accent-red"
              style={{
                textShadow: '0 0 20px rgba(233,69,96,0.5)',
              }}
            >
              ROYS
            </span>
            <p className="mt-4 text-text-secondary text-sm font-body leading-relaxed max-w-xs">
              El camarero IA que transforma la experiencia de tu restaurante.
            </p>
          </div>

          {/* Link columns */}
          {footerColumns.map((column) => (
            <div key={column.title}>
              <h4 className="font-display text-sm font-semibold text-text-primary mb-4 tracking-wide">
                {column.title}
              </h4>
              <ul className="space-y-2">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-text-secondary text-sm font-body hover:text-text-primary transition-colors duration-200"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="h-px bg-white/10 mb-6" />

        {/* Copyright */}
        <div className="text-center text-text-secondary text-xs font-body">
          &copy; {new Date().getFullYear()} ROYS. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}
