/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Liquid-glass light theme — silver ground, ink type, prismatic accents
        base: '#DFE1E5',
        panel: '#FFFFFF',
        ink: '#182030',
        mute: '#5B6674',
        accent: '#3E6FF0', // azure — primary accent
        cyan2: '#35C8E8',
        viol: '#8B7CF7',
        blush: '#F0A8C8',
        amber2: '#E8B06A',
        key: '#FFFFFF',
      },
      fontFamily: {
        sans: ['"Inter Variable"', 'Inter', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        tightest: '-0.04em',
      },
    },
  },
  plugins: [],
};
