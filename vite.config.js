import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'url'
import path from 'path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // 1. Load ALL variables from .env, including those without VITE_ prefix
  // The third argument '' tells VITE to load all variables, not just those starting with VITE_
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      // 2. Use the PORT variable, or fallback to 5173 if missing
      port: parseInt(env.PORT, 10) || 5173,
    },
  }
})
