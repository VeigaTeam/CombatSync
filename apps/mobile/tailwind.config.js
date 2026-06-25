/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0ea5e9',
          foreground: '#ffffff',
        },
        background: '#0f172a',
        foreground: '#f8fafc',
        card: '#1e293b',
        border: '#334155',
        muted: '#64748b',
      },
    },
  },
  plugins: [],
};
