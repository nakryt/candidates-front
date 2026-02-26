import react from "@vitejs/plugin-react";
import type { MinifyOptions } from "terser";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],

  // Build optimizations
  build: {
    // Use terser for better minification (slower but smaller output)
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log in production
        drop_debugger: true,
        pure_funcs: ["console.log", "console.info"], // Remove specific console methods
      },
      mangle: {
        safari10: true, // Safari 10 compatibility
      },
      format: {
        comments: false, // Remove all comments
      },
    } satisfies MinifyOptions,

    // Code splitting configuration
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunk for React and related libraries
          "react-vendor": ["react", "react-dom"],

          // Separate chunk for lucide-react icons (large library)
          "icons": ["lucide-react"],

          // Axios separate chunk
          "api": ["axios"],
        },
      },
    },

    // Chunk size warnings
    chunkSizeWarningLimit: 500, // Warn if chunks exceed 500kB

    // Source maps for debugging (disable in production)
    sourcemap: false,

    // Target modern browsers for smaller output
    target: "esnext",

    // CSS code splitting
    cssCodeSplit: true,
  },

  // Test configuration
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/test/setup.ts",
  },
});
