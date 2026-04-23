import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  server: {
    port: 3000
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        dashboard: resolve(__dirname, 'dashboard.html'),
        bon: resolve(__dirname, 'bon.html'),
        pembayaran: resolve(__dirname, 'pembayaran.html'),
        laporan: resolve(__dirname, 'laporan.html'),
        master: resolve(__dirname, 'master.html'),
        histori: resolve(__dirname, 'histori.html'),
        void: resolve(__dirname, 'void.html'),
        pencarian: resolve(__dirname, 'pencarian.html'),
        setting: resolve(__dirname, 'setting.html')
      }
    }
  }
})
