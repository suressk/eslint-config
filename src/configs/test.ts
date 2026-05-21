import type { OptionsOverrides, TypedFlatConfigItem } from '../types'

import { GLOB_TESTS } from '../globs'
import { tryInteropDefault } from '../utils'

export async function test(
  options: OptionsOverrides & { files?: string[], isInEditor?: boolean } = {},
): Promise<TypedFlatConfigItem[]> {
  const { files = GLOB_TESTS, isInEditor = false, overrides = {} } = options

  const [pluginVitest, pluginNoOnlyTests] = await Promise.all([
    tryInteropDefault(import('@vitest/eslint-plugin')),
    tryInteropDefault(import('eslint-plugin-no-only-tests')),
  ] as const)

  if (!pluginVitest && !pluginNoOnlyTests)
    return []

  const configs: TypedFlatConfigItem[] = []

  if (pluginVitest) {
    configs.push({
      name: 'suressk/test/setup',
      plugins: {
        test: pluginVitest,
      },
    })
  }

  configs.push({
    files,
    name: 'suressk/test/rules',
    rules: {
      ...(pluginVitest as any)?.configs?.recommended?.rules ?? {},

      'test/consistent-test-it': ['error', { fn: 'it', withinDescribe: 'it' }],
      'test/no-identical-title': 'error',
      'test/prefer-hooks-in-order': 'error',
      'test/prefer-lowercase-title': 'error',
      'test/valid-describe-callback': 'error',
      'test/valid-expect': 'error',

      'no-only-tests/no-only-tests': isInEditor ? 'off' : 'error',

      ...overrides,
    },
    plugins: {
      ...(pluginNoOnlyTests ? { 'no-only-tests': pluginNoOnlyTests } : {}),
    },
  })

  return configs
}
