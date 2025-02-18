import path from "path"
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/branch-viewer/',
  plugins: [react()],
  build: {
    lib: {
      entry: 'src/main.tsx',
      name: 'BranchViewer',
      fileName: 'branch-viewer',
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src")
    },
  },
}); 