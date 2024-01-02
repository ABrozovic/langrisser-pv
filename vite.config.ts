/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tsconfigPaths from 'vite-tsconfig-paths'
import path from 'path'

// https://vitejs.dev/config https://vitest.dev/config
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  build: {
    minify: false,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@pixi-spine/base': path.resolve(
        __dirname,
        'local_modules/@pixi-spine/base/src',
      ),
      '@pixi-spine/runtime-3.4': path.resolve(
        __dirname,
        'local_modules/@pixi-spine/runtime-3.4/src',
      ),
      '@pixi-spine/runtime-3.7': path.resolve(
        __dirname,
        'local_modules/@pixi-spine/runtime-3.7/src',
      ),
      '@pixi-spine/runtime-3.8': path.resolve(
        __dirname,
        'local_modules/@pixi-spine/runtime-3.8/src',
      ),
      '@pixi-spine/runtime-4.0': path.resolve(
        __dirname,
        'local_modules/@pixi-spine/runtime-4.0/src',
      ),
      '@pixi-spine/runtime-4.1': path.resolve(
        __dirname,
        'local_modules/@pixi-spine/runtime-4.1/src',
      ),
    },
  },

  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: '.vitest/setup',
    include: ['**/test.{ts,tsx}'],
  },
})
