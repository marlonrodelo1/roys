/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        'bg-dark': '#050508',
        'accent-red': '#E94560',
        'accent-blue': '#0F3460',
        'accent-cyan': '#00d4ff',
        'accent-green': '#16C79A',
        'text-dim': '#555570',
      },
      fontFamily: {
        display: ['Orbitron', 'sans-serif'],
        body: ['Outfit', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
