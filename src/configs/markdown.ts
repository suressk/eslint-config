import type { OptionsFiles, OptionsOverrides, TypedFlatConfigItem } from '../types'

import { GLOB_MARKDOWN, GLOB_MARKDOWN_CODE } from '../globs'
import { tryInteropDefault } from '../utils'

export async function markdown(
  options: OptionsOverrides & OptionsFiles & { componentExts?: string[] } = {},
): Promise<TypedFlatConfigItem[]> {
  const { componentExts: _componentExts = [], overrides = {} } = options
  const files = options.files ?? [GLOB_MARKDOWN]

  const pluginMarkdown = await tryInteropDefault(import('@eslint/markdown'))

  return [
    {
      name: 'suressk/markdown/plugin',
      plugins: {
        markdown: pluginMarkdown,
      },
    },
    {
      files,
      name: 'suressk/markdown/processor',
      processor: 'markdown/markdown',
      rules: {
        'no-irregular-whitespace': 'off',
      },
    },
    {
      files: [GLOB_MARKDOWN_CODE],
      name: 'suressk/markdown/rules',
      rules: {
        'no-undef': 'off',
        'no-unused-vars': 'off',
        'unused-imports/no-unused-vars': 'off',
        ...overrides,
      },
    },
  ]
}
