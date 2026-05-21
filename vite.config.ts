import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
  build: {
    target: 'node18',
    outDir: 'dist',
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      formats: ['es'],
      fileName: () => 'index.mjs',
    },
    rollupOptions: {
      external: [
        'eslint',
        'eslint-flat-config-utils',
        /^@typescript-eslint\//,
        /^eslint-plugin-/,
        /^@eslint-community\//,
        /^@eslint\//,
        /^@stylistic\//,
        '@vitest/eslint-plugin', 'eslint-plugin-no-only-tests',
        'vue-eslint-parser',
        'yaml-eslint-parser',
        'toml-eslint-parser',
        'astro-eslint-parser',
        'svelte-eslint-parser',
        'eslint-config-flat-gitignore',
        'local-pkg',
        'node:process',
        'node:url',
      ],
      output: {
        codeSplitting: false,
      },
    },
  },
  plugins: [
    dts({
      include: ['src'],
      exclude: ['src/plugins.ts'],
      bundleTypes: true,
    }),
  ],
})
