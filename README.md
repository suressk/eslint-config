# @suressk/eslint-config

K.'s preset ESLint configuration.

Built with the compose pattern for ESLint flat config.

## Usage Install

```bash
pnpm add -D eslint @suressk/eslint-config
```

All required plugins and parsers are included as dependencies — no additional installs needed.

## Usage

```ts
// eslint.config.ts
import lintPreset from '@suressk/eslint-config'

export default lintPreset({
  typescript: true,
  jsonc: true,
  yaml: true,
})
```

### Compose API

The `lintPreset()` function returns a `FlatConfigComposer` with chainable methods:

```ts
export default lintPreset({ typescript: true })
  .prepend({
    ignores: ['**/generated/**'],
  })
  .override('suressk/typescript/rules', {
    rules: {
      'ts/explicit-module-boundary-types': 'off',
    },
  })
  .append({
    files: ['**/*.d.ts'],
    rules: {
      'ts/no-explicit-any': 'off',
    },
  })
```

### Fine-Grained Composition

Import individual configs and combine them:

```ts
import {
  combine,
  javascript,
  typescript,
  jsonc,
  yaml,
} from '@suressk/eslint-config/configs'

export default combine(
  javascript(),
  typescript({ tsconfigPath: 'tsconfig.json' }),
  jsonc(),
  yaml(),
)
```

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `typescript` | `boolean \| { tsconfigPath?: string }` | `true` | Enable TypeScript rules |
| `javascript` | `boolean` | `true` | Enable base JS rules |
| `react` | `boolean \| { version?: string }` | `false` | Enable React rules |
| `vue` | `boolean` | `false` | Enable Vue SFC rules |
| `jsonc` | `boolean` | `true` | Enable JSON/JSONC/JSON5 rules |
| `yaml` | `boolean` | `true` | Enable YAML rules |
| `toml` | `boolean` | `false` | Enable TOML rules |
| `markdown` | `boolean` | `false` | Enable Markdown rules |
| `css` | `boolean` | `false` | Enable CSS/Less/SCSS rules |
| `graphql` | `boolean` | `false` | Enable GraphQL rules |
| `xml` | `boolean` | `false` | Enable XML rules |
| `astro` | `boolean` | `false` | Enable Astro rules |
| `svelte` | `boolean` | `false` | Enable Svelte rules |
| `comments` | `boolean` | `true` | Enable eslint-comments rules |
| `ignores` | `string[]` | - | Additional ignore patterns |
| `overrides` | `Record<string, unknown>` | - | Rule overrides |
| `renamePlugins` | `boolean` | `true` | Rename plugin prefixes (e.g. `@typescript-eslint` → `ts`) |

## Subpath Exports

| Path | Description |
|------|-------------|
| `@suressk/eslint-config` | Main entry - `lintPreset()` factory |
| `@suressk/eslint-config/configs` | Individual config modules |
| `@suressk/eslint-config/types` | Type definitions |
| `@suressk/eslint-config/utils` | Utility functions (`combine`, etc.) |
| `@suressk/eslint-config/globs` | Shared glob patterns |

## Supported File Types

- JavaScript: `.js`, `.cjs`, `.mjs`, `.jsx`
- TypeScript: `.ts`, `.cts`, `.mts`, `.tsx`
- Vue: `.vue`
- JSON: `.json`, `.jsonc`, `.json5`
- YAML: `.yml`, `.yaml`
- TOML: `.toml`
- Markdown: `.md`
- CSS: `.css`, `.less`, `.scss`, `.pcss`, `.postcss`
- GraphQL: `.gql`, `.graphql`
- XML: `.xml`
- Astro: `.astro`
- Svelte: `.svelte`

## License

MIT
