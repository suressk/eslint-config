import type { TypedFlatConfigItem } from '../types'

export async function comments(): Promise<TypedFlatConfigItem[]> {
  const [{ default: commentsPlugin }] = await Promise.all([
    import('@eslint-community/eslint-plugin-eslint-comments'),
  ])

  return [
    {
      name: 'suressk/comments/rules',
      plugins: {
        'eslint-comments': commentsPlugin,
      },
      rules: {
        'eslint-comments/no-unused-disable': 'warn',
        'eslint-comments/no-unused-enable': 'warn',
        'eslint-comments/no-duplicate-disable': 'error',
        'eslint-comments/no-restricted-disable': 'off',
        'eslint-comments/no-use': ['error', { allow: [] }],
        'eslint-comments/require-description': 'off',
      },
    },
  ]
}
