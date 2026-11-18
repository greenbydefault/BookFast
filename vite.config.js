import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  appType: 'spa',
  build: {
    // postbuild-marketing-seo.mjs reads the manifest to map prerendered asset URLs to hashed files.
    manifest: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        login: resolve(__dirname, 'login.html'),
        register: resolve(__dirname, 'register.html'),
        forgotPassword: resolve(__dirname, 'forgot-password.html'),
        updatePassword: resolve(__dirname, 'update-password.html'),
      },
      output: {
        manualChunks(id) {
          const isPdfExportModule =
            id.includes('/src/pages/dashboard/booking-detail/pdfExport.js') ||
            id.includes('/src/pages/dashboard/booking-detail/invoiceUtils.js') ||
            id.includes('/node_modules/pdfmake/');

          if (isPdfExportModule) {
            return 'pdf-export';
          }

          return undefined;
        },
      },
    },
  },
});
