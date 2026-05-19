import type { Awaitable, TypedFlatConfigItem } from './types'

export async function interopDefault<T>(
  m: Awaitable<T>,
): Promise<T extends { default: infer U } ? U : T> {
  const resolved = await m
  return (resolved as any).default ?? resolved
}

export async function combine(
  ...configs: Array<Awaitable<TypedFlatConfigItem | TypedFlatConfigItem[]>>
): Promise<TypedFlatConfigItem[]> {
  const resolved = await Promise.all(configs.map(async (c) => {
    const r = await c
    return Array.isArray(r) ? r : [r]
  }))
  return resolved.flat()
}

export function toArray<T>(value: T | T[]): T[] {
  return Array.isArray(value) ? value : [value]
}
