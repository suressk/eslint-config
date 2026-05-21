import type { TypedFlatConfigItem } from '../types'

/**
 * Sort package.json and tsconfig.json keys using jsonc rules.
 */
export function sortPackageJson(): TypedFlatConfigItem {
  return {
    files: ['**/package.json'],
    name: 'suressk/sort/package-json',
    rules: {
      'jsonc/sort-keys': ['error', {
        order: [
          'name',
          'version',
          'private',
          'description',
          'packageManager',
          'type',
          'exports',
          'main',
          'module',
          'types',
          'bin',
          'files',
          'scripts',
          'keywords',
          'author',
          'license',
          'peerDependencies',
          'dependencies',
          'devDependencies',
          'lint-staged',
          'pnpm',
        ],
        pathPattern: '^$',
      }],
    },
  }
}

export function sortTsconfig(): TypedFlatConfigItem {
  return {
    files: ['**/tsconfig.json', '**/tsconfig.*.json'],
    name: 'suressk/sort/tsconfig',
    rules: {
      'jsonc/sort-keys': ['error', {
        order: [
          'extends',
          'compilerOptions',
          'references',
          'files',
          'include',
          'exclude',
        ],
        pathPattern: '^$',
      },
      {
        order: [
          'target',
          'module',
          'moduleResolution',
          'declaration',
          'declarationMap',
          'outDir',
          'rootDir',
          'strict',
          'allowSyntheticDefaultImports',
          'esModuleInterop',
          'skipLibCheck',
          'forceConsistentCasingInFileNames',
        ],
        pathPattern: '^compilerOptions$',
      }],
    },
  }
}
