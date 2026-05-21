import type { Awaitable, TypedFlatConfigItem } from './types'

import process from 'node:process'
import { isPackageExists } from 'local-pkg'

export const parserPlain = {
  meta: {
    name: 'parser-plain',
  },
  parseForESLint: (code: string) => ({
    ast: {
      body: [],
      comments: [],
      loc: { end: code.length, start: 0 },
      range: [0, code.length],
      tokens: [],
      type: 'Program',
    },
    scopeManager: null,
    services: { isPlain: true },
    visitorKeys: {
      Program: [],
    },
  }),
}

export async function combine(
  ...configs: Array<Awaitable<TypedFlatConfigItem | TypedFlatConfigItem[]>>
): Promise<TypedFlatConfigItem[]> {
  const resolved = await Promise.all(configs)
  return resolved.flat()
}

export function toArray<T>(value: T | T[]): T[] {
  return Array.isArray(value) ? value : [value]
}

export async function interopDefault<T>(
  m: Awaitable<T>,
): Promise<T extends { default: infer U } ? U : T> {
  const resolved = await m
  return (resolved as any).default ?? resolved
}

export async function tryImport<T>(importer: Promise<T>): Promise<T | null> {
  try {
    return await importer
  }
  catch {
    return null
  }
}

export async function tryInteropDefault<T>(
  importer: Promise<T>,
): Promise<T extends { default: infer U } ? U | null : T | null> {
  const m = await tryImport(importer)
  if (m == null) return null as any
  return (m as any).default ?? m
}

export function renameRules(
  rules: Record<string, any>,
  map: Record<string, string>,
): Record<string, any> {
  return Object.fromEntries(
    Object.entries(rules)
      .map(([key, value]) => {
        for (const [from, to] of Object.entries(map)) {
          if (key.startsWith(`${from}/`))
            return [to + key.slice(from.length), value]
        }
        return [key, value]
      }),
  )
}

export function renamePluginInConfigs(
  configs: TypedFlatConfigItem[],
  map: Record<string, string>,
): TypedFlatConfigItem[] {
  return configs.map((i) => {
    const clone = { ...i }
    if (clone.rules)
      clone.rules = renameRules(clone.rules, map)
    if (clone.plugins) {
      clone.plugins = Object.fromEntries(
        Object.entries(clone.plugins)
          .map(([key, value]) => {
            if (key in map)
              return [map[key], value]
            return [key, value]
          }),
      )
    }
    return clone
  })
}

export function isPackageInScope(name: string): boolean {
  return isPackageExists(name)
}

export async function ensurePackages(packages: Array<string | undefined>): Promise<void> {
  if (process.env.CI || process.stdout.isTTY === false || !isPackageExists('@suressk/eslint-config'))
    return

  const nonExistingPackages = packages.filter(i => i && !isPackageInScope(i)) as string[]
  if (nonExistingPackages.length === 0)
    return

  // eslint-disable-next-line no-console
  console.warn(
    `[@suressk/eslint-config] The following packages are required but not installed: ${nonExistingPackages.join(', ')}`,
  )
  // eslint-disable-next-line no-console
  console.warn(`Please install them manually: pnpm add -D ${nonExistingPackages.join(' ')}`)
}

export function isInEditorEnv(): boolean {
  if (process.env.CI)
    return false
  if (isInGitHooksOrLintStaged())
    return false
  return !!(
    process.env.VSCODE_PID
    || process.env.VSCODE_CWD
    || process.env.JETBRAINS_IDE
    || process.env.VIM
    || process.env.NVIM
    || (process.env.ZED_ENVIRONMENT && !process.env.ZED_TERM)
  )
}

export function isInGitHooksOrLintStaged(): boolean {
  return !!(
    process.env.GIT_PARAMS
    || process.env.VSCODE_GIT_COMMAND
    || process.env.npm_lifecycle_script?.startsWith('lint-staged')
  )
}
