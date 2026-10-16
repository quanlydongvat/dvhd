import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
  build: {
    target: 'es2020',
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/exceljs') || id.includes('node_modules/xlsx')) {
            return 'vendor-excel';
          }
          if (id.includes('node_modules/leaflet') || id.includes('node_modules/react-leaflet')) {
            return 'vendor-map';
          }
          if (id.includes('node_modules/chart.js') || id.includes('node_modules/react-chartjs-2')) {
            return 'vendor-charts';
          }
          if (id.includes('node_modules/firebase')) {
            return 'vendor-firebase';
          }
        },
      },
    },
  },
});
