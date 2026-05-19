import type { OptionsOverrides, OptionsFiles, TypedFlatConfigItem } from '../types'

import { GLOB_JSX, GLOB_TSX } from '../globs'

export async function react(
  options: OptionsOverrides & OptionsFiles & { version?: string } = {},
): Promise<TypedFlatConfigItem[]> {
  const { overrides = {}, version = 'detect' } = options
  const files = options.files ?? [GLOB_JSX, GLOB_TSX]

  const [{ default: reactPlugin }, { default: reactHooksPlugin }] = await Promise.all([
    import('eslint-plugin-react'),
    import('eslint-plugin-react-hooks'),
  ])

  return [
    {
      name: 'suressk/react/setup',
      plugins: {
        react: reactPlugin,
        'react-hooks': reactHooksPlugin,
      },
      settings: {
        react: { version },
      },
    },
    {
      name: 'suressk/react/rules',
      files,
      rules: {
        // React 17+ JSX transform
        'react/jsx-uses-react': 'off',
        'react/react-in-jsx-scope': 'off',

        // Best practices
        'react/jsx-uses-vars': 'error',
        'react/jsx-no-undef': 'error',
        'react/jsx-key': ['warn', { checkFragmentShorthand: true }],
        'react/no-children-prop': 'error',
        'react/no-danger-with-children': 'warn',
        'react/no-deprecated': 'warn',
        'react/no-direct-mutation-state': 'error',
        'react/no-find-dom-node': 'warn',
        'react/no-render-return-value': 'error',
        'react/no-string-refs': 'error',
        'react/no-unescaped-entities': 'warn',
        'react/no-unknown-property': 'error',
        'react/require-render-return': 'error',

        // Hooks
        'react-hooks/rules-of-hooks': 'error',
        'react-hooks/exhaustive-deps': 'warn',

        // Style
        'react/self-closing-comp': 'warn',
        'react/jsx-curly-brace-presence': ['warn', { props: 'never', children: 'never' }],
        'react/jsx-boolean-value': ['warn', 'never'],
        'react/jsx-no-useless-fragment': 'warn',

        ...overrides,
      },
    },
  ]
}
