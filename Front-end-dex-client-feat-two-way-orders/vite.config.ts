import react from '@vitejs/plugin-react';
import * as path from 'path';
import { defineConfig } from 'vite';
import topLevelAwait from 'vite-plugin-top-level-await';
import wasm from 'vite-plugin-wasm';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    wasm(),
    topLevelAwait(),
    {
      name: 'markdown-loader',
      transform(code, id) {
        if (id.slice(-3) === '.md') {
          return `export default ${JSON.stringify(code)};`;
        }
      },
    },
  ],
  resolve: {
    alias: {
      '~': path.resolve(__dirname, 'src'),
    },
  },
  define: {
    'process.env': {
      NODE_ENV: mode,
      'process.env.SENTRY_RELEASE': JSON.stringify(process.env.SENTRY_RELEASE),
    },
  },
}));
