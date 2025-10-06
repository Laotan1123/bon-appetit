import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/bon-appetit/',          // ensures correct asset paths on GH Pages
  plugins: [react()],
  build: {
    outDir: 'build'               // gh-pages will publish this folder
  }
});
