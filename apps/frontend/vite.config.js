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
        setting: resolve(__dirname, 'setting.html'),
        join: resolve(__dirname, 'join.html'),
        pelanggan: resolve(__dirname, 'pelanggan.html'),
        marketing: resolve(__dirname, 'marketing.html'),
        'audit-kpi': resolve(__dirname, 'audit-kpi.html'),
        'dasbort-menu': resolve(__dirname, 'dasbort_menu.html'),
        'dasbort-finance': resolve(__dirname, 'dasbort_finance.html'),
        'dasbort-marketing': resolve(__dirname, 'dasbort_marketing.html'),
        'dasbort-hrd': resolve(__dirname, 'dasbort_hrd.html'),
        'dasbort-crm': resolve(__dirname, 'dasbort_crm.html'),
        'komplain-pelanggan': resolve(__dirname, 'komplain_pelanggan.html'),
        'stok-ayam': resolve(__dirname, 'stok_ayam.html'),
        'laporan-komplain': resolve(__dirname, 'laporan_komplain.html'),
        'rekruitmen': resolve(__dirname, 'rekruitmen.html')
      }
    }
  }
})
