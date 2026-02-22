import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'url'
import path from 'path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load variables into the Vite Node.js context so we can access non-VITE variables (like PORT).
  // NOTE: This does NOT expose these secrets to the browser. React still only sees VITE_-prefixed variables.
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      // Use the PORT variable, or fallback to 5173 if missing
      port: parseInt(env.PORT, 10) || 5173,
    },
  }
})
