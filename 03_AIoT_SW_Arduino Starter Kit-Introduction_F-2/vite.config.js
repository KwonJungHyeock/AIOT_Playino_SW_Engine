import { defineConfig } from 'vite';

// 정적 빌드 → dist/ → Vercel. base:'./' 상대경로(스펙 §7).
export default defineConfig({
  base: './',
  server: { port: 5173 },
  build: { outDir: 'dist', assetsInlineLimit: 0 },
});
