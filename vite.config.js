import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    // Katta kutubxonalarni alohida bo'laklarga ajratamiz.
    // Shunda brauzer ularni bir marta yuklab, keyingi tashriflarda keshdan oladi —
    // sayt sezilarli darajada tez ochiladi.
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
          supabase: ['@supabase/supabase-js'],
          leaflet: ['leaflet'],
          icons: ['lucide-react'],
        },
      },
    },
    chunkSizeWarningLimit: 700,
  },
});
