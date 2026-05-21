import type { OptionsOverrides, TypedFlatConfigItem } from '../types'

import { GLOB_SRC } from '../globs'
import { pluginUnusedImports } from '../plugins'

export function javascript(
  options: OptionsOverrides & { files?: string[] } = {},
): TypedFlatConfigItem[] {
  const { overrides = {} } = options

  return [
    {
      name: 'suressk/javascript/setup',
      languageOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        parserOptions: {
          ecmaFeatures: { jsx: true },
        },
      },
    },
    {
      files: options.files ?? [GLOB_SRC],
      name: 'suressk/javascript/rules',
      plugins: {
        'unused-imports': pluginUnusedImports,
      },
      rules: {
        // Best practices from eslint:recommended
        'no-alert': 'warn',
        'no-console': 'warn',
        'no-debugger': 'error',
        'no-var': 'error',
        'prefer-const': 'error',
        'no-const-assign': 'error',
        'eqeqeq': ['error', 'always', { null: 'ignore' }],
        'no-duplicate-imports': 'error',
        'no-self-assign': 'error',
        'no-self-compare': 'error',
        'no-template-curly-in-string': 'warn',
        'no-unmodified-loop-condition': 'warn',
        'no-unreachable-loop': 'error',
        'no-use-before-define': 'off',
        'no-unused-vars': 'off',

        // Style
        'object-shorthand': ['error', 'always'],
        'prefer-arrow-callback': 'warn',
        'prefer-template': 'warn',
        'spaced-comment': ['warn', 'always', { markers: ['/'] }],

        // ES6+
        'prefer-destructuring': ['warn', { object: true, array: false }],
        'prefer-rest-params': 'error',
        'prefer-spread': 'error',

        // Unused imports
        'unused-imports/no-unused-imports': 'error',
        'unused-imports/no-unused-vars': ['error', {
          argsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        }],

        ...overrides,
      },
    },
  ]
}
