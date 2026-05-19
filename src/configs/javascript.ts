import type {
  OptionsOverrides,
  TypedFlatConfigItem,
} from '../types'

import { sortImportsByLength } from '../rules/sort-imports-by-length'
import { GLOB_SRC } from '../globs'

export async function javascript(
  options: OptionsOverrides & { files?: string[] } = {}
): Promise<TypedFlatConfigItem[]> {
  const { overrides = {} } = options

  const { default: stylistic } = await import('@stylistic/eslint-plugin')

  return [
    {
      name: 'suressk/javascript/setup',
      plugins: {
        '@stylistic': stylistic as any,
        '@suressk': { rules: { 'sort-imports-by-length': sortImportsByLength } } as any,
      },
      languageOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        parserOptions: {
          ecmaFeatures: {
            jsx: true,
          },
        },
        globals: {
          // Common browser globals
          window: 'readonly',
          document: 'readonly',
          console: 'readonly',
          navigator: 'readonly',
          location: 'readonly',
          fetch: 'readonly',
          // Node.js globals
          process: 'readonly',
          global: 'readonly',
          Buffer: 'readonly',
          __dirname: 'readonly',
          __filename: 'readonly',
          module: 'readonly',
          require: 'readonly',
          exports: 'readonly',
          // ES2022+
          Promise: 'readonly',
          Map: 'readonly',
          Set: 'readonly',
          WeakMap: 'readonly',
          WeakSet: 'readonly',
          Symbol: 'readonly',
          Proxy: 'readonly',
          Reflect: 'readonly',
          Intl: 'readonly',
          BigInt: 'readonly',
        },
      },
    },
    {
      name: 'suressk/javascript/rules',
      files: options.files ?? [GLOB_SRC],
      rules: {
        // Best practices
        'no-console': 'warn',
        'no-debugger': 'error',
        'no-alert': 'warn',
        'eqeqeq': ['error', 'always', { null: 'ignore' }],
        'no-var': 'error',
        'prefer-const': 'error',
        'no-const-assign': 'error',
        'no-duplicate-imports': 'error',
        'no-self-assign': 'error',
        'no-self-compare': 'error',
        'no-template-curly-in-string': 'warn',
        'no-unmodified-loop-condition': 'warn',
        'no-unreachable-loop': 'error',
        'no-unused-vars': 'off',
        'no-use-before-define': 'off',

        // Style
        '@stylistic/indent': ['error', 2],
        '@stylistic/keyword-spacing': ['error', { before: true, after: true }],
        '@stylistic/no-multi-spaces': 'error',
        'object-shorthand': ['error', 'always'],
        'prefer-arrow-callback': 'warn',
        'prefer-template': 'warn',
        '@stylistic/spaced-comment': ['warn', 'always', { markers: ['/'] }],
        'no-else-return': 'warn',
        '@stylistic/object-curly-spacing': ['error', 'always'],
        '@stylistic/object-curly-newline': ['error', {
          ObjectExpression: { multiline: true, consistent: true },
          ObjectPattern: { multiline: true },
          ImportDeclaration: { multiline: true },
          ExportDeclaration: { multiline: true },
        }],
        '@stylistic/max-len': ['error', { code: 120, ignoreStrings: true }],
        '@stylistic/comma-dangle': ['error', {
          arrays: 'always-multiline',
          objects: 'always-multiline',
          imports: 'always-multiline',
          exports: 'always-multiline',
          functions: 'never',
        }],

        // Import sorting
        '@suressk/sort-imports-by-length': ['error', {
          blankLineBetweenGroups: true,
        }],

        // File size
        'max-lines': ['error', { max: 600, skipBlankLines: true, skipComments: true }],

        // ES6+
        'prefer-destructuring': ['warn', { object: true, array: false }],
        'prefer-rest-params': 'error',
        'prefer-spread': 'error',
        'no-useless-constructor': 'warn',
        'no-useless-computed-key': 'warn',

        ...overrides,
      },
    },
  ]
}
