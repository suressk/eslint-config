import type { OptionsOverrides, TypedFlatConfigItem } from '../types'

import { tryInteropDefault } from '../utils'

export async function regexp(
  options: OptionsOverrides = {},
): Promise<TypedFlatConfigItem[]> {
  const { overrides = {} } = options

  const pluginRegexp = await tryInteropDefault(import('eslint-plugin-regexp'))
  if (!pluginRegexp)
    return []

  return [
    {
      name: 'suressk/regexp/rules',
      plugins: {
        regexp: pluginRegexp,
      },
      rules: {
        ...(pluginRegexp as any).configs['flat/recommended']?.rules ?? {},
        ...overrides,
      },
    },
  ]
}
