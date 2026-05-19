import type { OptionsOverrides, OptionsFiles, TypedFlatConfigItem } from '../types'
import type { Linter } from 'eslint'

import { GLOB_VUE } from '../globs'

export async function vue(
  options: OptionsOverrides & OptionsFiles & { vueVersion?: 2 | 3 } = {},
): Promise<TypedFlatConfigItem[]> {
  const { overrides = {}, vueVersion = 3 } = options
  const files = options.files ?? [GLOB_VUE]

  const [{ default: pluginVue }] = await Promise.all([
    import('eslint-plugin-vue'),
  ])

  const parser = (await import('vue-eslint-parser')) as unknown as Linter.Parser

  return [
    {
      name: 'suressk/vue/setup',
      plugins: {
        vue: pluginVue as any,
      },
    },
    {
      name: 'suressk/vue/rules',
      files,
      languageOptions: {
        parser,
        parserOptions: {
          ecmaFeatures: { jsx: true },
          extraFileExtensions: ['.vue'],
          parser: await import('@typescript-eslint/parser') as any,
          sourceType: 'module',
        },
      },
      rules: {
        ...(vueVersion === 3
          ? (pluginVue as any).configs?.['vue3-recommended']?.rules ?? {}
          : (pluginVue as any).configs?.['vue2-recommended']?.rules ?? {}
        ),

        // Override some rules
        'vue/multi-word-component-names': 'off',
        'vue/no-v-html': 'warn',
        'vue/require-default-prop': 'off',
        'vue/require-prop-types': 'warn',
        'vue/component-name-in-template-casing': ['error', 'PascalCase'],
        'vue/component-definition-name-casing': ['error', 'PascalCase'],
        'vue/prefer-import-from-vue': 'error',
        'vue/block-order': ['error', { order: ['script', 'template', 'style'] }],
        'vue/no-duplicate-attr-inheritance': 'error',
        'vue/no-empty-component-block': 'warn',

        ...overrides,
      },
    },
  ]
}
