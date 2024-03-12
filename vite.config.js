import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import istanbul from 'vite-plugin-istanbul';

export default defineConfig({
  server: {
    host: true,
  },
  plugins: [ istanbul({
      include: ['client/*', 'imports/*', 'server/*'],
      exclude: [
        'node_modules',
        'tests/**/*',
        'packages/**/*',
        '.coverage/**',
        '.vite-inspect/**',
        '**.scannerwork/**'
      ],
      extension: ['.js', '.vue'],
      cypress: true
      //  requireEnv: true
    }),
	  vue()],
  meteor: {
    clientEntry: 'imports/ui/main.js',
  },
  optimizeDeps: {
    exclude: ['vue-meteor-tracker'],
    entries: ['imports/ui/main.js'],
  },
})
