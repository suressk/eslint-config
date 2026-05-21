import type { OptionsComponentExts, OptionsFiles, OptionsOverrides, OptionsProjectType, OptionsTypeScriptParserOptions, OptionsTypeScriptWithTypes, TypedFlatConfigItem } from '../types'

import { GLOB_TS, GLOB_TSX } from '../globs'
import { renameRules, tryInteropDefault } from '../utils'

export async function typescript(
  options: OptionsFiles & OptionsComponentExts & OptionsOverrides & OptionsTypeScriptWithTypes & OptionsTypeScriptParserOptions & OptionsProjectType & { overridesTypeAware?: Record<string, unknown> } = {},
): Promise<TypedFlatConfigItem[]> {
  const {
    componentExts = [],
    overrides = {},
    overridesTypeAware = {},
    parserOptions = {},
    type = 'app',
  } = options

  const files = options.files ?? [
    GLOB_TS,
    GLOB_TSX,
    ...componentExts.map(ext => `**/*.${ext}`),
  ]

  const tsconfigPath = options.tsconfigPath ?? undefined
  const isTypeAware = !!tsconfigPath

  const [pluginTs, parserTs] = await Promise.all([
    tryInteropDefault(import('@typescript-eslint/eslint-plugin')),
    tryInteropDefault(import('@typescript-eslint/parser')),
  ] as const)

  if (!pluginTs || !parserTs)
    return []

  function makeParser(typeAware: boolean, files: string[], ignores?: string[]): TypedFlatConfigItem {
    return {
      files,
      ...(ignores ? { ignores } : {}),
      languageOptions: {
        parser: parserTs,
        parserOptions: {
          extraFileExtensions: componentExts.map(ext => `.${ext}`),
          sourceType: 'module',
          ...(typeAware
            ? {
                projectService: {
                  allowDefaultProject: ['./*.js'],
                  defaultProject: tsconfigPath,
                },
                tsconfigRootDir: process.cwd(),
              }
            : {}),
          ...parserOptions as any,
        },
      },
      name: `suressk/typescript/${typeAware ? 'type-aware-parser' : 'parser'}`,
    }
  }

  const typeAwareRules = {
    'dot-notation': 'off',
    'no-implied-eval': 'off',
    'ts/await-thenable': 'error',
    'ts/dot-notation': ['error', { allowKeywords: true }],
    'ts/no-floating-promises': 'error',
    'ts/no-for-in-array': 'error',
    'ts/no-implied-eval': 'error',
    'ts/no-misused-promises': 'error',
    'ts/no-unnecessary-type-assertion': 'error',
    'ts/no-unsafe-argument': 'error',
    'ts/no-unsafe-assignment': 'error',
    'ts/no-unsafe-call': 'error',
    'ts/no-unsafe-member-access': 'error',
    'ts/no-unsafe-return': 'error',
    'ts/promise-function-async': 'error',
    'ts/restrict-plus-operands': 'error',
    'ts/restrict-template-expressions': 'error',
    'ts/return-await': ['error', 'in-try-catch'],
    'ts/strict-boolean-expressions': ['error', { allowNullableBoolean: true, allowNullableObject: true }],
    'ts/unbound-method': 'error',
  }

  return [
    {
      name: 'suressk/typescript/setup',
      plugins: {
        ts: pluginTs as any,
      },
    },
    // Assign parser(s) - type-aware for specific files if tsconfig provided
    ...(isTypeAware
      ? [
          makeParser(false, files),
          makeParser(true, files, []),
        ]
      : [
          makeParser(false, files),
        ]),
    {
      files,
      name: 'suressk/typescript/rules',
      rules: {
        ...renameRules(
          (pluginTs as any).configs['eslint-recommended']?.overrides?.[0]?.rules ?? {},
          { '@typescript-eslint': 'ts' },
        ),
        ...renameRules(
          (pluginTs as any).configs.strict?.rules ?? {},
          { '@typescript-eslint': 'ts' },
        ),
        'no-dupe-class-members': 'off',
        'no-redeclare': 'off',
        'no-use-before-define': 'off',
        'no-useless-constructor': 'off',
        'ts/ban-ts-comment': ['error', { 'ts-expect-error': 'allow-with-description' }],
        'ts/consistent-type-definitions': ['error', 'interface'],
        'ts/consistent-type-imports': ['error', {
          disallowTypeAnnotations: false,
          fixStyle: 'separate-type-imports',
          prefer: 'type-imports',
        }],
        'ts/method-signature-style': ['error', 'property'],
        'ts/no-dupe-class-members': 'error',
        'ts/no-empty-object-type': ['error', { allowInterfaces: 'always' }],
        'ts/no-explicit-any': 'off',
        'ts/no-import-type-side-effects': 'error',
        'ts/no-require-imports': 'error',
        'ts/no-unused-vars': 'off',
        'ts/no-use-before-define': ['error', { classes: false, functions: false, variables: true }],
        'ts/no-wrapper-object-types': 'error',
        'ts/triple-slash-reference': 'off',

        ...(type === 'lib'
          ? {
              'ts/explicit-function-return-type': ['error', {
                allowExpressions: true,
                allowHigherOrderFunctions: true,
                allowIIFEs: true,
              }],
            }
          : {}),
        ...overrides,
      },
    },
    ...(isTypeAware
      ? [{
          files,
          name: 'suressk/typescript/rules-type-aware',
          rules: {
            ...typeAwareRules,
            ...overridesTypeAware,
          },
        }]
      : []),
  ]
}
