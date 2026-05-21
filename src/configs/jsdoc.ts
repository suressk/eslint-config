import type { OptionsStylistic, TypedFlatConfigItem } from '../types'

import { tryInteropDefault } from '../utils'

export async function jsdoc(
  options: OptionsStylistic = {},
): Promise<TypedFlatConfigItem[]> {
  const { stylistic = true } = options

  const pluginJsdoc = await tryInteropDefault(import('eslint-plugin-jsdoc'))
  if (!pluginJsdoc)
    return []

  return [
    {
      name: 'suressk/jsdoc/rules',
      plugins: {
        jsdoc: pluginJsdoc,
      },
      rules: {
        'jsdoc/check-access': 'warn',
        'jsdoc/check-param-names': 'warn',
        'jsdoc/check-property-names': 'warn',
        'jsdoc/check-types': 'warn',
        'jsdoc/empty-tags': 'warn',
        'jsdoc/implements-on-classes': 'warn',
        'jsdoc/no-defaults': 'warn',
        'jsdoc/no-multi-asterisks': 'warn',
        'jsdoc/require-param-name': 'warn',
        'jsdoc/require-property-name': 'warn',
        'jsdoc/require-returns-check': 'warn',
        'jsdoc/require-yields-check': 'warn',

        ...(stylistic
          ? {
              'jsdoc/tag-lines': ['warn', 'any', { startLines: 1 }],
              'jsdoc/require-asterisk-prefix': 'warn',
            }
          : {}),
      },
    },
  ]
}
