import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    // three.js lands in its own lazy chunk (HeroScene is React.lazy'd),
    // so the initial bundle stays light.
    chunkSizeWarningLimit: 1200,
  },
});
