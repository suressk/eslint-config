import type { OptionsFiles, OptionsOverrides, TypedFlatConfigItem } from '../types'

import { GLOB_STYLE } from '../globs'
import { parserPlain } from '../utils'

export async function css(
  options: OptionsOverrides & OptionsFiles = {},
): Promise<TypedFlatConfigItem[]> {
  const { overrides = {} } = options
  const files = options.files ?? [GLOB_STYLE]

  return [
    {
      files,
      name: 'suressk/css/rules',
      languageOptions: {
        parser: parserPlain,
      },
      rules: {
        'no-irregular-whitespace': 'off',
        ...overrides,
      },
    },
  ]
}
