import type { OptionsFiles, OptionsOverrides, OptionsStylistic, TypedFlatConfigItem } from '../types'

import { GLOB_ASTRO } from '../globs'
import { tryInteropDefault } from '../utils'

export async function astro(
  options: OptionsOverrides & OptionsFiles & OptionsStylistic = {},
): Promise<TypedFlatConfigItem[]> {
  const { overrides = {} } = options
  const files = options.files ?? [GLOB_ASTRO]

  const [pluginAstro, parserAstro] = await Promise.all([
    tryInteropDefault(import('eslint-plugin-astro')),
    tryInteropDefault(import('astro-eslint-parser')),
  ] as const)

  if (!pluginAstro || !parserAstro)
    return []

  const tsParser = await tryInteropDefault(import('@typescript-eslint/parser'))

  return [
    {
      name: 'suressk/astro/setup',
      plugins: {
        astro: pluginAstro as any,
      },
    },
    {
      files,
      name: 'suressk/astro/rules',
      languageOptions: {
        parser: parserAstro,
        parserOptions: {
          extraFileExtensions: ['.astro'],
          parser: tsParser ?? undefined,
        },
      },
      rules: {
        ...(pluginAstro as any).configs?.recommended?.rules ?? {},
        'astro/no-conflict-set-directives': 'error',
        'astro/no-unused-define-vars-in-style': 'error',
        'astro/valid-compile': 'error',
        ...overrides,
      },
    },
  ]
}
