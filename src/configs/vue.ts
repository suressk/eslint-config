import type { OptionsFiles, OptionsOverrides, OptionsStylistic, TypedFlatConfigItem } from '../types'

import { GLOB_VUE } from '../globs'
import { parserPlain, tryInteropDefault } from '../utils'

export async function vue(
  options: OptionsOverrides & OptionsFiles & OptionsStylistic & { typescript?: boolean, vueVersion?: 2 | 3 } = {},
): Promise<TypedFlatConfigItem[]> {
  const { overrides = {}, stylistic: stylisticOpt = true, typescript = false, vueVersion = 3 } = options
  const files = options.files ?? [GLOB_VUE]

  const [pluginVue, parserVue] = await Promise.all([
    tryInteropDefault(import('eslint-plugin-vue')),
    tryInteropDefault(import('vue-eslint-parser')),
  ] as const)

  if (!pluginVue || !parserVue)
    return []

  const tsParser = typescript
    ? await tryInteropDefault(import('@typescript-eslint/parser'))
    : null

  return [
    {
      name: 'suressk/vue/setup',
      plugins: {
        vue: pluginVue as any,
      },
    },
    {
      files,
      name: 'suressk/vue/rules',
      languageOptions: {
        parser: parserVue,
        parserOptions: {
          ecmaFeatures: { jsx: true },
          extraFileExtensions: ['.vue'],
          parser: tsParser ?? parserPlain,
          sourceType: 'module',
        },
      },
      rules: {
        ...(vueVersion === 3
          ? (pluginVue as any).configs['flat/recommended']?.rules ?? {}
          : {}),
        'vue/multi-word-component-names': 'off',
        'vue/no-v-html': 'warn',
        'vue/require-default-prop': 'off',
        'vue/component-name-in-template-casing': ['error', 'PascalCase'],
        'vue/block-order': ['error', { order: ['script', 'template', 'style'] }],
        'vue/no-empty-component-block': 'warn',

        ...(stylisticOpt
          ? {
              'vue/attributes-order': ['error', { order: ['DEFINITION', 'LIST_RENDERING', 'CONDITIONALS', 'RENDER_MODIFIERS', 'GLOBAL', 'UNIQUE', 'TWO_WAY_BINDING', 'OTHER_DIRECTIVES', 'OTHER_ATTR', 'EVENTS', 'CONTENT'] }],
              'vue/component-api-style': ['error', ['script-setup', 'composition']],
              'vue/no-v-text': 'error',
              'vue/padding-line-between-blocks': ['error', 'always'],
            }
          : {}),

        ...overrides,
      },
    },
  ]
}
