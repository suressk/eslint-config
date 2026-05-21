import type { OptionsOverrides, OptionsStylistic, StylisticConfig, TypedFlatConfigItem } from '../types'

import { tryInteropDefault } from '../utils'

export const StylisticConfigDefaults: StylisticConfig = {
  braceStyle: 'stroustrup',
  indent: 2,
  jsx: true,
  quotes: 'single',
  semi: false,
}

export async function stylistic(
  options: StylisticConfig & OptionsOverrides & OptionsStylistic = {},
): Promise<TypedFlatConfigItem[]> {
  const {
    braceStyle,
    indent,
    jsx,
    overrides = {},
    quotes,
    semi,
  } = {
    ...StylisticConfigDefaults,
    ...options,
  }

  const pluginStylistic = await tryInteropDefault(import('@stylistic/eslint-plugin'))
  if (!pluginStylistic)
    return []

  const config = (pluginStylistic as any).configs.customize({
    braceStyle,
    indent,
    jsx,
    pluginName: 'style',
    quotes,
    semi,
  }) as TypedFlatConfigItem

  return [
    {
      name: 'suressk/stylistic/rules',
      plugins: {
        style: pluginStylistic,
      },
      rules: {
        ...config.rules,
        'style/generator-star-spacing': ['error', { after: true, before: false }],
        'style/yield-star-spacing': ['error', { after: true, before: false }],
        ...overrides,
      },
    },
  ]
}
