import type { OptionsOverrides, TypedFlatConfigItem } from '../types'

import { GLOB_CSS, GLOB_GRAPHQL, GLOB_HTML, GLOB_LESS, GLOB_POSTCSS, GLOB_SCSS, GLOB_XML } from '../globs'
import { tryInteropDefault } from '../utils'

export async function formatters(
  options: OptionsOverrides & { indent?: number | 'tab' } = {},
): Promise<TypedFlatConfigItem[]> {
  const { indent = 2, overrides = {} } = options

  const [pluginFormat, stylistic] = await Promise.all([
    tryInteropDefault(import('eslint-plugin-format')),
    tryInteropDefault(import('@stylistic/eslint-plugin')),
  ] as const)

  if (!pluginFormat)
    return []

  const stylisticRules = (stylistic as any)?.configs?.customize?.({
    indent,
    pluginName: 'format',
  })?.rules ?? {}

  return [
    {
      files: [GLOB_CSS, GLOB_LESS, GLOB_SCSS, GLOB_POSTCSS],
      language: 'css/css',
      name: 'suressk/formatters/css',
      rules: {
        ...stylisticRules,
        'format/indent': ['error', indent],
        ...overrides,
      },
    },
    {
      files: [GLOB_HTML],
      language: 'html/html',
      name: 'suressk/formatters/html',
      rules: {
        ...stylisticRules,
        'format/indent': ['error', indent],
        ...overrides,
      },
    },
    {
      files: [GLOB_XML],
      language: 'xml/xml',
      name: 'suressk/formatters/xml',
      rules: {
        ...stylisticRules,
        'format/indent': ['error', indent],
        ...overrides,
      },
    },
    {
      files: [GLOB_GRAPHQL],
      language: 'graphql/graphql',
      name: 'suressk/formatters/graphql',
      rules: {
        ...stylisticRules,
        'format/indent': ['error', indent],
        ...overrides,
      },
    },
    {
      name: 'suressk/formatters/setup',
      plugins: {
        format: pluginFormat as any,
      },
    },
  ]
}
