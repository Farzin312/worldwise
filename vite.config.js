import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import eslint from 'vite-plugin-eslint'
import MillionLint from "@million/lint";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), eslint(), MillionLint.vite()],
})
