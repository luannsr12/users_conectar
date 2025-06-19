import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    base: '/',
    define: {
      'process.env.NODE_ENV': JSON.stringify(mode), // define apenas o necessário
    },
    server: {
      port: Number(env.VITE_PORT) || 5173,
      host: env.VITE_HOST === 'true',
    },
    preview: {
      port: Number(env.VITE_PORT) || 4173,
      host: env.VITE_HOST === 'true',
    },
  };
});
