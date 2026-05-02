import { defineConfig } from 'vite';
import { qwikVite } from '@builder.io/qwik/optimizer';
import { qwikCity } from '@builder.io/qwik-city/vite';
import { cloudflarePagesAdapter } from '@builder.io/qwik-city/adapters/cloudflare-pages/vite';

export default defineConfig(({ mode }) => ({
  plugins: [
    qwikCity(),
    qwikVite(),
    ...(mode === 'cloudflare-pages' ? [cloudflarePagesAdapter()] : []),
  ],
}));
