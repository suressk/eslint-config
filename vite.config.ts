import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import { resolve } from 'path'

export default defineConfig({
  build: {
    target: 'node18',
    outDir: 'dist',
    lib: {
      entry: {
        index: resolve(__dirname, 'src/index.ts'),
        'configs/index': resolve(__dirname, 'src/configs/index.ts'),
        types: resolve(__dirname, 'src/types.ts'),
        utils: resolve(__dirname, 'src/utils.ts'),
        globs: resolve(__dirname, 'src/globs.ts'),
      },
      formats: ['es'],
    },
    rollupOptions: {
      external: [
        'eslint',
        'eslint-flat-config-utils',
        /^@typescript-eslint\//,
        /^eslint-plugin-/,
        /^@eslint-community\//,
        /^@eslint\//,
        'vue-eslint-parser',
        'yaml-eslint-parser',
        'toml-eslint-parser',
        'astro-eslint-parser',
        'svelte-eslint-parser',
        'local-pkg',
      ],
      output: {
        preserveModules: true,
        preserveModulesRoot: 'src',
      },
    },
  },
  plugins: [
    dts({
      outDir: 'dist',
      include: ['src'],
      exclude: ['src/plugins.ts'],
    }),
  ],
})
