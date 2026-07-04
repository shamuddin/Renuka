import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // Served under renuka.world/anniversary/ (same domain, not a subdomain).
  base: '/anniversary/',
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
  },
  assetsInclude: ['**/*.glb', '**/*.gltf', '**/*.hdr'],
});
