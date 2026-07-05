/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        base: '#0A0D12',
        panel: '#0F141B',
        ink: '#F2F5F7',
        mute: '#93A0AD',
        accent: '#A8F04B',
        'accent-dim': '#6FA332',
        // Warm key-light color — matches the 3D key light in src/lib/lighting.js
        key: '#FFD9A8',
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
