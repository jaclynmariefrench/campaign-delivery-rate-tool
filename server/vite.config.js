import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        resetPasswordForm: './adminjs/resetPasswordFormEntry.jsx',
        emailPasswordResetForm: './adminjs/emailPasswordResetFormEntry.jsx', 
      },
      output: {
        entryFileNames: '[name].js',
      },
    },
  },
});


