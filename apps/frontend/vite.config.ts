import { defineConfig } from 'vite';
import path from 'path';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3001,
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      external: [],
    },
  },
});

// lib: {
//       entry: path.resolve(__dirname, '../electron/main.ts'),
//       formats: ['cjs'],
//       fileName: () => 'bundle.js',
//     },
