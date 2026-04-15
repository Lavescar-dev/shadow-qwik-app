/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        term_bg: '#0a0a0a',
        term_fg: '#e5e5e5',
        term_accent: '#00ffcc',
        term_dim: '#262626',
      },
      fontFamily: {
        mono: ['"Fira Code"', 'Consolas', 'Monaco', 'monospace'],
      },
    },
  },
  plugins: [],
};
