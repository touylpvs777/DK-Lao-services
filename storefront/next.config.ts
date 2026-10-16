import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The repo root also has a package-lock.json; pin the workspace root to this app
  // so Turbopack resolves modules from storefront/node_modules.
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
