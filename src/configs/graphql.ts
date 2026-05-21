import type { OptionsFiles, OptionsOverrides, TypedFlatConfigItem } from '../types'

import { GLOB_GRAPHQL } from '../globs'
import { parserPlain } from '../utils'

export async function graphql(
  options: OptionsOverrides & OptionsFiles = {},
): Promise<TypedFlatConfigItem[]> {
  const { overrides = {} } = options
  const files = options.files ?? [GLOB_GRAPHQL]

  return [
    {
      files,
      name: 'suressk/graphql/rules',
      languageOptions: { parser: parserPlain },
      rules: {
        'no-irregular-whitespace': 'off',
        ...overrides,
      },
    },
  ]
}
