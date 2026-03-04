import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  appType: 'spa',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        login: resolve(__dirname, 'login.html'),
        register: resolve(__dirname, 'register.html'),
        forgotPassword: resolve(__dirname, 'forgot-password.html'),
        updatePassword: resolve(__dirname, 'update-password.html'),
      },
    },
  },
});
