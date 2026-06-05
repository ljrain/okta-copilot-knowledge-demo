import { realpathSync } from "node:fs";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

const projectRoot = realpathSync(dirname(fileURLToPath(import.meta.url)));

export default defineConfig({
  root: projectRoot,
  optimizeDeps: {
    include: [],
    noDiscovery: true
  },
  server: {
    host: "localhost",
    port: 3000,
    strictPort: true
  },
  preview: {
    host: "localhost",
    port: 3000,
    strictPort: true
  }
});
