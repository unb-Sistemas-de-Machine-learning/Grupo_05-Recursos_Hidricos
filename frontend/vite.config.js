// vite.config.js
import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  base: './',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        login: resolve(__dirname, 'login.html'),
        signup: resolve(__dirname, 'signup.html'),
        dashboard: resolve(__dirname, 'dashboard.html'),
        series: resolve(__dirname, 'series.html'),
        maps: resolve(__dirname, 'maps.html'),
        compare: resolve(__dirname, 'compare.html'),
        alerts: resolve(__dirname, 'alerts.html'),
        reports: resolve(__dirname, 'reports.html'),
        tutorial: resolve(__dirname, 'tutorial.html'),
      },
    },
  },
})