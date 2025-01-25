import { defineConfig } from 'vite';
    import react from '@vitejs/plugin-react';

    export default defineConfig({
      plugins: [react()],
      css: {
        modules: {
          localsConvention: 'camelCase'
        },
        preprocessorOptions: {
          scss: {
            additionalData: `@import "./src/index.css";`
          }
        }
      }
    });
