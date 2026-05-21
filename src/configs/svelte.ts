import type { OptionsFiles, OptionsOverrides, OptionsStylistic, TypedFlatConfigItem } from '../types'

import { GLOB_SVELTE } from '../globs'
import { tryInteropDefault } from '../utils'

export async function svelte(
  options: OptionsOverrides & OptionsFiles & OptionsStylistic & { typescript?: boolean } = {},
): Promise<TypedFlatConfigItem[]> {
  const { overrides = {}, typescript = false } = options
  const files = options.files ?? [GLOB_SVELTE]

  const [pluginSvelte, parserSvelte] = await Promise.all([
    tryInteropDefault(import('eslint-plugin-svelte')),
    tryInteropDefault(import('svelte-eslint-parser')),
  ] as const)

  if (!pluginSvelte || !parserSvelte)
    return []

  const tsParser = typescript
    ? await tryInteropDefault(import('@typescript-eslint/parser'))
    : null

  return [
    {
      name: 'suressk/svelte/setup',
      plugins: {
        svelte: pluginSvelte as any,
      },
    },
    {
      files,
      name: 'suressk/svelte/rules',
      languageOptions: {
        parser: parserSvelte,
        parserOptions: {
          extraFileExtensions: ['.svelte'],
          parser: tsParser ?? undefined,
        },
      },
      rules: {
        ...(pluginSvelte as any).configs?.recommended?.rules ?? {},
        'svelte/no-dupe-else-if-blocks': 'error',
        'svelte/no-dupe-style-properties': 'error',
        'svelte/valid-compile': 'error',
        ...overrides,
      },
    },
  ]
}
