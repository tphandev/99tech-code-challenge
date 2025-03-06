import { defineConfig, UserConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    globals: true, // This is critical
    environment: "jsdom",
    setupFiles: ["./src/setupTests.ts"],
  },
} as UserConfig);
