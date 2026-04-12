import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) {
            if (id.includes("/src/pages/Landing/")) {
              return "landing";
            }

            if (id.includes("/src/pages/App/") || id.includes("/src/pages/Patients/")) {
              return "app-shell";
            }

            return undefined;
          }

          if (id.includes("react-router")) {
            return "router";
          }

          if (id.includes("@supabase")) {
            return "supabase";
          }

          if (id.includes("styled-components")) {
            return "styles";
          }

          return "vendor";
        },
      },
    },
  },
})
