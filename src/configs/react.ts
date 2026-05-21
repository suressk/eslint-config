import type { OptionsFiles, OptionsOverrides, TypedFlatConfigItem } from '../types'

import { GLOB_JSX, GLOB_TSX } from '../globs'
import { tryInteropDefault } from '../utils'

export async function react(
  options: OptionsOverrides & OptionsFiles & { version?: string } = {},
): Promise<TypedFlatConfigItem[]> {
  const { overrides = {}, version = 'detect' } = options
  const files = options.files ?? [GLOB_JSX, GLOB_TSX]

  const [pluginReact, pluginReactHooks] = await Promise.all([
    tryInteropDefault(import('eslint-plugin-react')),
    tryInteropDefault(import('eslint-plugin-react-hooks')),
  ] as const)

  if (!pluginReact)
    return []

  return [
    {
      name: 'suressk/react/setup',
      plugins: {
        react: pluginReact,
        ...(pluginReactHooks ? { 'react-hooks': pluginReactHooks } : {}),
      },
      settings: {
        react: { version },
      },
    },
    {
      files,
      name: 'suressk/react/rules',
      rules: {
        'react/jsx-uses-react': 'off',
        'react/react-in-jsx-scope': 'off',

        'react/jsx-uses-vars': 'error',
        'react/jsx-no-undef': 'error',
        'react/jsx-key': ['warn', { checkFragmentShorthand: true }],
        'react/no-children-prop': 'error',
        'react/no-danger-with-children': 'warn',
        'react/no-deprecated': 'warn',
        'react/no-direct-mutation-state': 'error',
        'react/no-string-refs': 'error',
        'react/no-unescaped-entities': 'warn',
        'react/no-unknown-property': 'error',

        ...(pluginReactHooks
          ? {
              'react-hooks/rules-of-hooks': 'error',
              'react-hooks/exhaustive-deps': 'warn',
            }
          : {}),

        'react/self-closing-comp': 'warn',
        'react/jsx-curly-brace-presence': ['warn', { props: 'never', children: 'never' }],
        'react/jsx-boolean-value': ['warn', 'never'],
        'react/jsx-no-useless-fragment': 'warn',

        ...overrides,
      },
    },
  ]
}
