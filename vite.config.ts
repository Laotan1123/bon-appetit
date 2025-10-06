import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/bon-appetit/',
  plugins: [react()],
  build: {
    outDir: 'build'
  }
});
