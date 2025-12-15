import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'import.meta.env.NEXT_PUBLIC_API_URL': JSON.stringify(env.NEXT_PUBLIC_API_URL),
        'import.meta.env.NEXT_PUBLIC_ADMIN_ENV': JSON.stringify(env.NEXT_PUBLIC_ADMIN_ENV),
        'import.meta.env.NEXT_PUBLIC_FRONTEND_URL': JSON.stringify(env.NEXT_PUBLIC_FRONTEND_URL),
        'import.meta.env.NEXT_PUBLIC_ADMIN_URL': JSON.stringify(env.NEXT_PUBLIC_ADMIN_URL)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
