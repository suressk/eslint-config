import type { OptionsOverrides, OptionsFiles, TypedFlatConfigItem } from '../types'
import type { Linter } from 'eslint'

import { GLOB_TS, GLOB_TSX } from '../globs'

export async function typescript(
  options: OptionsOverrides & OptionsFiles & { tsconfigPath?: string } = {},
): Promise<TypedFlatConfigItem[]> {
  const { overrides = {}, tsconfigPath } = options
  const files = options.files ?? [GLOB_TS, GLOB_TSX]

  const { default: tsPlugin } = await import('@typescript-eslint/eslint-plugin')

  const baseRules: Record<string, Linter.RuleEntry> = {
    '@typescript-eslint/no-unused-vars': ['error', {
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_',
      caughtErrorsIgnorePattern: '^_',
    }],
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-inferrable-types': 'off',
    '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports', disallowTypeAnnotations: false }],
    '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
    '@typescript-eslint/ban-ts-comment': ['error', { 'ts-ignore': 'allow-with-description' }],
    '@typescript-eslint/prefer-ts-expect-error': 'error',
    '@typescript-eslint/no-require-imports': 'warn',
    '@typescript-eslint/array-type': ['error', { default: 'array-simple' }],
    '@typescript-eslint/no-empty-object-type': 'warn',
    '@typescript-eslint/no-unsafe-declaration-merging': 'off',

    ...overrides,
  }

  // Type-aware rules only enabled when tsconfigPath is provided
  const typeAwareRules: Record<string, Linter.RuleEntry> = tsconfigPath ? {
    '@typescript-eslint/no-floating-promises': 'error',
    '@typescript-eslint/no-misused-promises': 'error',
    '@typescript-eslint/await-thenable': 'error',
    '@typescript-eslint/no-unnecessary-type-assertion': 'warn',
    '@typescript-eslint/prefer-nullish-coalescing': 'warn',
    '@typescript-eslint/prefer-optional-chain': 'warn',
  } : {}

  const configs: TypedFlatConfigItem[] = [
    {
      name: 'suressk/typescript/setup',
      plugins: {
        '@typescript-eslint': tsPlugin as any,
      },
    },
    {
      name: 'suressk/typescript/rules',
      files,
      languageOptions: {
        parser: await import('@typescript-eslint/parser') as unknown as Linter.Parser,
        parserOptions: {
          ...(tsconfigPath ? { project: [tsconfigPath] } : {}),
        },
      },
      rules: {
        ...baseRules,
        ...typeAwareRules,
      },
    },
  ]

  return configs
}
