import type { OptionsFiles, OptionsOverrides, TypedFlatConfigItem } from '../types'

import { GLOB_XML } from '../globs'
import { parserPlain } from '../utils'

export async function xml(
  options: OptionsOverrides & OptionsFiles = {},
): Promise<TypedFlatConfigItem[]> {
  const { overrides = {} } = options
  const files = options.files ?? [GLOB_XML]

  return [
    {
      files,
      name: 'suressk/xml/rules',
      languageOptions: { parser: parserPlain },
      rules: {
        'no-irregular-whitespace': 'off',
        ...overrides,
      },
    },
  ]
}
