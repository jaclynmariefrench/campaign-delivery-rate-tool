import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  publicDir: 'static',
  build: {
    outDir: 'public',
    rollupOptions: {
      input: './adminjs/resetPasswordFormEntry.jsx',
      output: {
        entryFileNames: 'resetPasswordForm.js',
      },
    },
  },
});


