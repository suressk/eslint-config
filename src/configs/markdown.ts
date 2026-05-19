import type { OptionsOverrides, OptionsFiles, TypedFlatConfigItem } from '../types'

import { GLOB_MARKDOWN } from '../globs'

export async function markdown(
  options: OptionsOverrides & OptionsFiles = {},
): Promise<TypedFlatConfigItem[]> {
  const { overrides = {} } = options
  const files = options.files ?? [GLOB_MARKDOWN]

  const [{ default: markdownPlugin }] = await Promise.all([
    import('@eslint/markdown'),
  ])

  return [
    {
      name: 'suressk/markdown/setup',
      plugins: {
        markdown: markdownPlugin as any,
      },
    },
    {
      name: 'suressk/markdown/rules',
      files,
      plugins: {
        markdown: markdownPlugin as any,
      },
      // Use processor from markdown plugin if available
      ...(markdownPlugin.processors
        ? { processor: markdownPlugin.processors.markdown }
        : {}),
      rules: {
        'no-irregular-whitespace': 'off',
        'no-undef': 'off',
        'no-unused-vars': 'off',

        ...overrides,
      },
    },
  ]
}
