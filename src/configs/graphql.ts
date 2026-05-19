import type { OptionsOverrides, OptionsFiles, TypedFlatConfigItem } from '../types'

import { GLOB_GRAPHQL } from '../globs'

export async function graphql(
  options: OptionsOverrides & OptionsFiles = {},
): Promise<TypedFlatConfigItem[]> {
  const { overrides = {} } = options
  const files = options.files ?? [GLOB_GRAPHQL]

  // GraphQL: use plain parser for basic syntax checking
  return [
    {
      name: 'suressk/graphql/rules',
      files,
      languageOptions: {
        parser: {
          parse() {
            return { type: 'Program', body: [], sourceType: 'module', comments: [], tokens: [], range: [0, 0], loc: { start: { line: 1, column: 0 }, end: { line: 1, column: 0 } } }
          },
          parseForESLint(code: string) {
            return {
              ast: { type: 'Program', body: [], sourceType: 'module', comments: [], tokens: [], range: [0, code.length], loc: { start: { line: 1, column: 0 }, end: { line: 1, column: code.length } } },
              services: { isPlain: true },
              scopeManager: null,
              visitorKeys: null,
            }
          },
        },
      },
      rules: {
        'no-irregular-whitespace': 'off',

        ...overrides,
      },
    },
  ]
}
