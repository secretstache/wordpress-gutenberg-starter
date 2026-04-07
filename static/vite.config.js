import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { processCSSFunctions } from '../shared/vite-css.js';
import postcssCustomMedia from 'postcss-custom-media';
import { viteStaticCopy } from 'vite-plugin-static-copy';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  base: process.env.VITE_PREFIX ?? '/',
  css: {
    postcss: {
      plugins: [
        postcssCustomMedia(),
      ],
    },
  },
  plugins: [
    processCSSFunctions(),
    tailwindcss(),
    react(),
    viteStaticCopy({
      targets: [
        { src: resolve(__dirname, '../resources/fonts'), dest: 'assets', rename: { stripBase: 1 }, },
        { src: resolve(__dirname, '../resources/images'), dest: 'assets', rename: { stripBase: 1 }, },
        { src: resolve(__dirname, '../resources/video'), dest: 'assets', rename: { stripBase: 1 }, },
      ],
    }),
  ],
  resolve: {
    alias: {
      '@theme': resolve(__dirname, '../theme.json'),
      '@styles': resolve(__dirname, '../resources/styles'),
      '@scripts': resolve(__dirname, 'src/assets/scripts'),
      '@shared':  resolve(__dirname, '../shared'),
      '@data':    resolve(__dirname, 'src/data'),
      '@global':  resolve(__dirname, 'src/global'),
      '@blocks':  resolve(__dirname, 'src/blocks'),
      '@layouts': resolve(__dirname, 'src/layouts'),
      '@lib':     resolve(__dirname, 'src/lib'),
      '@pages':   resolve(__dirname, 'src/pages'),
    },
  },
  publicDir: false,
  server: {
    historyApiFallback: true,
  },
});
