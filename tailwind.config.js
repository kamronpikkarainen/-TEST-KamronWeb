/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Liquid-glass light theme — silver ground, ink type, prismatic accents
        base: '#DFE1E5',
        panel: '#FFFFFF',
        ink: '#0F1520',
        mute: '#4C5866',
        accent: '#2E5FE8', // azure — primary accent
        cyan2: '#35C8E8',
        viol: '#8B7CF7',
        blush: '#F0A8C8',
        amber2: '#E8B06A',
        key: '#FFFFFF',
      },
      fontFamily: {
        sans: ['"Inter Variable"', 'Inter', 'system-ui', 'sans-serif'],
        // Bold poster-style display face for the "Kamron Web" wordmark.
        display: ['Anton', 'Impact', 'sans-serif'],
      },
      letterSpacing: {
        tightest: '-0.04em',
      },
    },
  },
  plugins: [],
};
