import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react({
    jsxImportSource: '@emotion/react',
    babel: {
      plugins: ['@emotion/babel-plugin']
    }
  })],
  base: './',
  build: {
    outDir: 'dist', // Default output directory
    assetsDir: 'assets' // Default assets directory (relative to outDir)
  },
  optimizeDeps: {
    include: ['@emotion/react', '@emotion/styled']
  }
});
