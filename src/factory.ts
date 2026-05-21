import type { Awaitable, PresetOptions, TypedFlatConfigItem } from './types'

import { FlatConfigComposer } from 'eslint-flat-config-utils'
import { isPackageExists } from 'local-pkg'
import {
  astro,
  comments,
  disables,
  formatters,
  ignores,
  imports,
  javascript,
  jsdoc,
  jsonc,
  jsx,
  markdown,
  node,
  perfectionist,
  react,
  regexp,
  sortPackageJson,
  sortTsconfig,
  stylistic,
  svelte,
  test,
  toml,
  typescript,
  unicorn,
  vue,
  yaml,
} from './configs'
import { isInEditorEnv, tryInteropDefault } from './utils'

export const defaultPluginRenaming = {
  '@stylistic': 'style',
  '@typescript-eslint': 'ts',
  'import-lite': 'import',
  'n': 'node',
  'vitest': 'test',
  'yml': 'yaml',
}

const flatConfigProps: Array<keyof TypedFlatConfigItem> = [
  'name',
  'languageOptions',
  'linterOptions',
  'processor',
  'plugins',
  'rules',
  'settings',
]

const VuePackages = ['vue', 'nuxt', 'vitepress', '@slidev/cli']

export function lintPreset(
  options: PresetOptions & Omit<TypedFlatConfigItem, 'files' | 'ignores'> = {},
  ...userConfigs: Array<Awaitable<TypedFlatConfigItem | TypedFlatConfigItem[]>>
): FlatConfigComposer<TypedFlatConfigItem> {
  const {
    astro: enableAstro = false,
    comments: _enableComments = true,
    componentExts = [],
    css: _enableCss = false,
    formatters: enableFormatters = false,
    graphql: _enableGraphql = false,
    ignores: userIgnores = [],
    imports: enableImports = true,
    isInEditor: _isInEditor,
    javascript: _enableJavascript = true,
    jsdoc: enableJsdoc = true,
    jsonc: enableJsonc = true,
    jsx: enableJsx = true,
    lessOpinionated: _lessOpinionated = false,
    markdown: enableMarkdown = true,
    node: enableNode = true,
    perfectionist: enablePerfectionist = true,
    react: enableReact = false,
    regexp: enableRegexp = true,
    renamePlugins: autoRenamePlugins = true,
    stylistic: enableStylistic = true,
    svelte: enableSvelte = false,
    test: enableTest = true,
    toml: enableToml = true,
    typescript: enableTypeScript = isPackageExists('typescript'),
    unicorn: enableUnicorn = true,
    vue: enableVue = VuePackages.some(i => isPackageExists(i)),
    xml: _enableXml = false,
    yaml: enableYaml = true,
  } = options

  let isInEditor = _isInEditor
  if (isInEditor == null) {
    isInEditor = isInEditorEnv()
  }

  const stylisticOptions = enableStylistic === false
    ? false
    : typeof enableStylistic === 'object'
      ? enableStylistic
      : {}

  if (stylisticOptions && !('jsx' in stylisticOptions)) {
    stylisticOptions.jsx = typeof enableJsx === 'object' ? true : enableJsx
  }

  const typescriptOptions = resolveSubOptions(options, 'typescript')
  const _tsconfigPath = 'tsconfigPath' in typescriptOptions ? typescriptOptions.tsconfigPath : undefined

  const configs: Array<Awaitable<TypedFlatConfigItem | TypedFlatConfigItem[]>> = []

  // gitignore integration
  configs.push(
    tryInteropDefault(import('eslint-config-flat-gitignore')).then(r => r
      ? [r({
          name: 'suressk/gitignore',
          strict: false,
        })]
      : []),
  )

  // Base configs (always on)
  configs.push(
    ignores(userIgnores),
    javascript({
      overrides: getOverrides(options, 'javascript'),
    }),
    comments(),
  )

  if (enablePerfectionist) {
    configs.push(perfectionist({
      overrides: getOverrides(options, 'perfectionist'),
    }))
  }

  if (enableImports) {
    configs.push(imports({
      stylistic: stylisticOptions,
      overrides: getOverrides(options, 'imports'),
    }))
  }

  if (enableNode) {
    configs.push(node())
  }

  if (enableJsdoc) {
    configs.push(jsdoc({ stylistic: stylisticOptions }))
  }

  if (enableUnicorn) {
    configs.push(unicorn(
      typeof enableUnicorn === 'object' ? enableUnicorn : {},
    ))
  }

  if (enableJsx) {
    configs.push(jsx(
      typeof enableJsx === 'object' ? enableJsx : {},
    ))
  }

  if (enableTypeScript) {
    configs.push(typescript({
      ...typescriptOptions,
      componentExts,
      overrides: getOverrides(options, 'typescript'),
      type: 'app',
    }))
  }

  if (stylisticOptions) {
    configs.push(stylistic({
      ...stylisticOptions,
      overrides: getOverrides(options, 'stylistic'),
    }))
  }

  if (enableRegexp) {
    configs.push(regexp({
      overrides: getOverrides(options, 'regexp'),
    }))
  }

  if (enableTest) {
    configs.push(test({
      isInEditor,
      overrides: getOverrides(options, 'test'),
    }))
  }

  if (enableVue) {
    configs.push(vue({
      ...resolveSubOptions(options, 'vue'),
      overrides: getOverrides(options, 'vue'),
      stylistic: stylisticOptions,
      typescript: !!enableTypeScript,
    }))
  }

  if (enableReact) {
    configs.push(react({
      overrides: getOverrides(options, 'react'),
    }))
  }

  if (enableSvelte) {
    configs.push(svelte({
      overrides: getOverrides(options, 'svelte'),
      stylistic: stylisticOptions,
      typescript: !!enableTypeScript,
    }))
  }

  if (enableAstro) {
    configs.push(astro({
      overrides: getOverrides(options, 'astro'),
      stylistic: stylisticOptions,
    }))
  }

  if (enableJsonc) {
    configs.push(
      jsonc({
        overrides: getOverrides(options, 'jsonc'),
        stylistic: stylisticOptions,
      }),
      sortPackageJson(),
      sortTsconfig(),
    )
  }

  if (enableYaml) {
    configs.push(
      yaml({
        overrides: getOverrides(options, 'yaml'),
        stylistic: stylisticOptions,
      }),
    )
  }

  if (enableToml) {
    configs.push(
      toml({
        overrides: getOverrides(options, 'toml'),
        stylistic: stylisticOptions,
      }),
    )
  }

  if (enableMarkdown) {
    configs.push(
      markdown({
        componentExts,
        overrides: getOverrides(options, 'markdown'),
      }),
    )
  }

  if (enableFormatters) {
    configs.push(
      formatters(
        typeof enableFormatters === 'boolean' ? {} : enableFormatters,
      ),
    )
  }

  configs.push(disables())

  // User can optionally pass a flat config item to the first argument
  const fusedConfig = flatConfigProps.reduce((acc, key) => {
    if (key in options)
      (acc as any)[key] = (options as any)[key]
    return acc
  }, {} as TypedFlatConfigItem)

  if (Object.keys(fusedConfig).length)
    configs.push([fusedConfig])

  let composer = new FlatConfigComposer<TypedFlatConfigItem>()

  composer = composer.append(
    ...configs,
    ...userConfigs as any,
  )

  if (autoRenamePlugins) {
    composer = composer.renamePlugins(defaultPluginRenaming)
  }

  return composer
}

export function resolveSubOptions<K extends keyof PresetOptions>(
  options: PresetOptions,
  key: K,
): any {
  return typeof options[key] === 'boolean'
    ? {}
    : options[key] || {}
}

export function getOverrides<K extends keyof PresetOptions>(
  options: PresetOptions,
  key: K,
): Record<string, unknown> {
  const sub = resolveSubOptions(options, key)
  return {
    ...((options.overrides as any)?.[key] ?? {}),
    ...((sub as any)?.overrides ?? {}),
  }
}
