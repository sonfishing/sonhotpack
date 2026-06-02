import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';
import fs from 'fs';

export default defineConfig(() => {
  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'cloudflare-pages',
        closeBundle() {
          const root = process.cwd();
          const out = path.resolve(root, 'dist');
          if (!fs.existsSync(out)) fs.mkdirSync(out, { recursive: true });
          fs.copyFileSync(path.resolve(root, '_headers'), path.resolve(out, '_headers'));
          fs.copyFileSync(path.resolve(root, '_redirects'), path.resolve(out, '_redirects'));
        },
      },
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
