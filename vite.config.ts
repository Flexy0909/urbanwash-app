// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, nitro (build-only using cloudflare as a default target),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  nitro: {
    preset: "vercel",
    externals: {
      inline: [
        "mysql2",
        "denque",
        "generate-function",
        "iconv-lite",
        "long",
        "named-placeholders",
        "seq-queue",
        "sqlstring"
      ]
    }
  },
  tanstackStart: {
    server: { entry: "server" },
  },
  vite: {
    build: {
      rollupOptions: {
        // Exclude native database modules from client bundles
        external: ["mysql2", "mysql2/promise"],
      },
    },
    ssr: {
      noExternal: ["mysql2", "mysql2/promise"],
    },
  },
});
