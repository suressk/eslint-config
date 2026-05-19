import type { OptionsOverrides, OptionsFiles, TypedFlatConfigItem } from '../types'
import type { Linter } from 'eslint'

import { GLOB_SVELTE } from '../globs'

export async function svelte(
  options: OptionsOverrides & OptionsFiles = {},
): Promise<TypedFlatConfigItem[]> {
  const { overrides = {} } = options
  const files = options.files ?? [GLOB_SVELTE]

  const [{ default: pluginSvelte }] = await Promise.all([
    import('eslint-plugin-svelte'),
  ])

  return [
    {
      name: 'suressk/svelte/setup',
      plugins: {
        svelte: pluginSvelte as any,
      },
    },
    {
      name: 'suressk/svelte/rules',
      files,
      languageOptions: {
        parser: (await import('svelte-eslint-parser')) as unknown as Linter.Parser,
        parserOptions: {
          extraFileExtensions: ['.svelte'],
          parser: await import('@typescript-eslint/parser') as any,
        },
      },
      rules: {
        ...(pluginSvelte as any).configs?.recommended?.rules ?? {},

        'svelte/no-at-debug-tags': 'warn',
        'svelte/no-at-html-tags': 'error',
        'svelte/no-dupe-else-if-blocks': 'error',
        'svelte/no-dupe-style-properties': 'error',
        'svelte/no-dynamic-slot-name': 'error',
        'svelte/no-not-function-handler': 'error',
        'svelte/no-object-in-text-mustaches': 'error',
        'svelte/no-shorthand-style-property-overrides': 'error',
        'svelte/no-unknown-style-directive-property': 'error',
        'svelte/valid-compile': 'error',

        ...overrides,
      },
    },
  ]
}
