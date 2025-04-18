import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tsconfigPaths from 'vite-tsconfig-paths';
import tailwindcss from 'tailwindcss';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  logLevel: 'info',
  css: {
    postcss: {
      plugins: [tailwindcss()],
    },
  },
});
