import type { TypedFlatConfigItem } from '../types'

/**
 * Granular per-scope rule disable overrides.
 * Relaxes certain rules for specific file types where they don't apply.
 */
export function disables(): TypedFlatConfigItem[] {
  return [
    // Disable certain rules in config files and scripts
    {
      files: [
        '**/eslint.config.?(m)[jt]s',
        '**/*.config.?(m)[jt]s',
        'scripts/**',
      ],
      name: 'suressk/disables/config-files',
      rules: {
        'no-console': 'off',
        'unused-imports/no-unused-imports': 'off',
        'ts/no-require-imports': 'off',
      },
    },
    // Disable type-aware rules for JS files
    {
      files: ['**/*.js', '**/*.mjs', '**/*.cjs'],
      name: 'suressk/disables/js-files',
      rules: {
        'ts/no-require-imports': 'off',
        'ts/no-unsafe-assignment': 'off',
        'ts/no-unsafe-call': 'off',
        'ts/no-unsafe-member-access': 'off',
      },
    },
    // Disable certain rules for declaration files
    {
      files: ['**/*.d.ts'],
      name: 'suressk/disables/dts',
      rules: {
        'unused-imports/no-unused-vars': 'off',
        'ts/no-require-imports': 'off',
      },
    },
    // Disable rules that don't apply inside markdown code blocks
    {
      files: ['**/*.md/**/*'],
      name: 'suressk/disables/markdown-code',
      rules: {
        'unused-imports/no-unused-imports': 'off',
        'unused-imports/no-unused-vars': 'off',
        'ts/no-require-imports': 'off',
      },
    },
    // Relax rules for test files
    {
      files: ['**/__tests__/**', '**/*.test.*', '**/*.spec.*'],
      name: 'suressk/disables/test-files',
      rules: {
        'no-console': 'off',
      },
    },
  ]
}
