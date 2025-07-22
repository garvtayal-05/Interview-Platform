import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 5171,
    allowedHosts: [
      '5393-136-233-11-130.ngrok-free.app', // 👈 ngrok domain
    ],
  },
  plugins: [react(), tailwindcss()],
});
