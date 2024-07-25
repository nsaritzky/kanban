import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import svgr from "vite-plugin-svgr"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), svgr()],
  server: {
    proxy: {
      "/kanban/api": { target: "http://localhost:3000", changeOrigin: true },
    },
  },
  base: "/",
})
