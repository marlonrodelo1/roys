/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        'bg-primary': '#0a0a0f',
        'bg-secondary': '#12121a',
        'bg-card': '#1a1a2e',
        'accent-red': '#E94560',
        'accent-blue': '#0F3460',
        'accent-cyan': '#00d4ff',
        'accent-green': '#16C79A',
        'text-primary': '#f0f0f0',
        'text-secondary': '#8892a4',
      },
      fontFamily: {
        body: ['Outfit', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
