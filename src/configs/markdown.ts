import type { OptionsFiles, OptionsOverrides, TypedFlatConfigItem } from '../types'

import { GLOB_MARKDOWN } from '../globs'

export async function markdown(
  options: OptionsOverrides & OptionsFiles & { componentExts?: string[] } = {},
): Promise<TypedFlatConfigItem[]> {
  const { componentExts: _componentExts = [], overrides = {} } = options
  const files = options.files ?? [GLOB_MARKDOWN]

  return [
    {
      files,
      name: 'suressk/markdown/rules',
      rules: {
        'no-irregular-whitespace': 'off',
        'no-undef': 'off',
        'no-unused-vars': 'off',
        'unused-imports/no-unused-vars': 'off',
        ...overrides,
      },
    },
  ]
}
