import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    base: '/',
    define: {
      'process.env.NODE_ENV': JSON.stringify(mode),
    },
    server: {
      port: Number(env.VITE_PORT) || 5173,
      host: env.VITE_HOST === 'true',
      allowedHosts: [
        'fabulous-laughter-production-e256.up.railway.app',
      ],
    },
    preview: {
      port: Number(env.VITE_PORT) || 4173,
      host: env.VITE_HOST === 'true',
      allowedHosts: [
        'all',
      ],
    },
  };
});
