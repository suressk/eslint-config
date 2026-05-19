import type { OptionsOverrides, OptionsFiles, TypedFlatConfigItem } from '../types'
import type { Linter } from 'eslint'

import { GLOB_ASTRO } from '../globs'

export async function astro(
  options: OptionsOverrides & OptionsFiles = {},
): Promise<TypedFlatConfigItem[]> {
  const { overrides = {} } = options
  const files = options.files ?? [GLOB_ASTRO]

  const [{ default: pluginAstro }] = await Promise.all([
    import('eslint-plugin-astro'),
  ])

  return [
    {
      name: 'suressk/astro/setup',
      plugins: {
        astro: pluginAstro as any,
      },
    },
    {
      name: 'suressk/astro/rules',
      files,
      languageOptions: {
        parser: (await import('astro-eslint-parser')) as unknown as Linter.Parser,
        parserOptions: {
          extraFileExtensions: ['.astro'],
          parser: await import('@typescript-eslint/parser') as any,
        },
      },
      rules: {
        ...(pluginAstro as any).configs?.recommended?.rules ?? {},

        'astro/no-conflict-set-directives': 'error',
        'astro/no-deprecated-astro-canonicalurl': 'error',
        'astro/no-deprecated-astro-fetchcontent': 'error',
        'astro/no-deprecated-astro-resolve': 'error',
        'astro/no-unused-define-vars-in-style': 'error',
        'astro/valid-compile': 'error',

        ...overrides,
      },
    },
  ]
}
