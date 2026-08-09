import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const base = globalThis.process?.env?.GITHUB_ACTIONS ? '/Rahat/' : '/'

export default defineConfig({
  base,
  plugins: [react()],
})
