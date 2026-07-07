import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';

/**
 * Single-file build: the entire production site — React, GSAP, Lenis,
 * three.js scene, fonts — inlined into one self-contained index.html.
 *
 *   npm run build:single   →  dist-single/index.html
 *
 * assetsInlineLimit is raised so the Inter woff2 files become data URIs;
 * the plugin forces one chunk (inlineDynamicImports), so the lazy
 * HeroScene import resolves from the same bundle.
 */
export default defineConfig({
  plugins: [react(), viteSingleFile()],
  build: {
    outDir: 'dist-single',
    assetsInlineLimit: 100000000,
    chunkSizeWarningLimit: 100000000,
  },
});
