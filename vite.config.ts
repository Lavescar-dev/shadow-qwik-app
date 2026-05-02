import { defineConfig } from 'vite';
import { qwikVite } from '@builder.io/qwik/optimizer';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [qwikVite()],
  build: {
    rollupOptions: {
      input: resolve(__dirname, 'index.html'),
      output: {
        manualChunks: (id) => {
          if (id.includes('/node_modules/three/')) return 'three';
        },
      },
    },
  },
});
