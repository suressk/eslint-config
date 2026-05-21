import type { TypedFlatConfigItem } from '../types'

import { pluginComments } from '../plugins'

export async function comments(): Promise<TypedFlatConfigItem[]> {
  return [
    {
      name: 'suressk/comments/rules',
      plugins: {
        'eslint-comments': pluginComments,
      },
      rules: {
        'eslint-comments/no-unused-disable': 'warn',
        'eslint-comments/no-unused-enable': 'warn',
        'eslint-comments/no-duplicate-disable': 'error',
      },
    },
  ]
}
