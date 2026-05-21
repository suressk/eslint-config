import type { AST, Rule, SourceCode } from 'eslint'

interface ImportInfo {
  node: AST.Program['body'][number]
  type: 'type' | 'value'
  length: number
  /** Source code text of the statement */
  text: string
  /** Range in source */
  range: [number, number]
  /** Whether this is an import declaration or a require call */
  kind: 'import' | 'require'
}

interface SortImportsByLengthOptions {
  maxLineLength?: number
  blankLineBetweenGroups?: boolean
}

const messages = {
  unsorted: 'Import statements should be sorted by line length (longest first, "reverse triangle" pattern).',
  groupSeparation: 'Expected a blank line between type imports and value imports.',
}

/**
 * Determine if an ImportDeclaration should be treated as a type import.
 * A declaration is a type import if it has importKind === 'type'
 * or if ALL specifiers have importKind === 'type'.
 */
function isTypeImport(node: any): boolean {
  if (node.importKind === 'type') return true
  if (node.specifiers && node.specifiers.length > 0) {
    return node.specifiers.every((s: any) => s.importKind === 'type')
  }
  return false
}

/**
 * Check if a VariableDeclaration is a top-level require() call.
 * e.g. const foo = require('foo')
 */
function isRequireDeclaration(node: any): boolean {
  if (node.type !== 'VariableDeclaration') return false
  const firstDecl = node.declarations?.[0]
  if (!firstDecl) return false
  const { init } = firstDecl
  if (!init || init.type !== 'CallExpression') return false
  return init.callee?.name === 'require'
}

export const sortImportsByLength: Rule.RuleModule = {
  meta: {
    type: 'layout',
    docs: {
      description:
        'Sort import/require statements by source line length in reverse-triangle (longest first) order. Type imports are grouped before value imports, separated by a blank line.',
    },
    fixable: 'code',
    schema: [
      {
        type: 'object',
        properties: {
          maxLineLength: {
            type: 'number',
            default: 120,
          },
          blankLineBetweenGroups: {
            type: 'boolean',
            default: true,
          },
        },
        additionalProperties: false,
      },
    ],
    messages,
  },

  create(context: Rule.RuleContext) {
    const options: SortImportsByLengthOptions = context.options[0] ?? {}
    const blankLineBetweenGroups = options.blankLineBetweenGroups ?? true
    const { sourceCode } = context

    const imports: ImportInfo[] = []

    function addImport(
      node: any,
      isType: boolean,
      kind: 'import' | 'require',
    ) {
      const text = sourceCode.getText(node as any)
      const range = node.range as [number, number]
      imports.push({
        node: node as unknown as AST.Program['body'][number],
        type: isType ? 'type' : 'value',
        length: text.length,
        text,
        range,
        kind,
      })
    }

    return {
      ImportDeclaration(node: any) {
        addImport(node, isTypeImport(node), 'import')
      },

      VariableDeclaration(node: any) {
        if (isRequireDeclaration(node)) {
          addImport(node, false, 'require')
        }
      },

      'Program:exit'() {
        if (imports.length <= 1) return

        // Separate into type and value groups
        const typeImports = imports.filter(i => i.type === 'type')
        const valueImports = imports.filter(i => i.type === 'value')

        // Sort each group by length descending (longest first)
        const sortGroup = (group: ImportInfo[]) =>
          [...group].sort((a, b) => {
            // Longer lines first
            if (a.length !== b.length) return b.length - a.length
            // Same length: preserve original order (stable)
            return (
              imports.indexOf(a) - imports.indexOf(b)
            )
          })

        const sortedTypes = sortGroup(typeImports)
        const sortedValues = sortGroup(valueImports)

        // Build the desired order
        const desired = [...sortedTypes, ...sortedValues]

        // Check if reordering is needed
        const needsSort = desired.some((imp, i) => imp.node !== imports[i].node)

        // Check for blank line between groups
        let needsBlankLine = false
        if (blankLineBetweenGroups && typeImports.length > 0 && valueImports.length > 0) {
          // Find the first value import in the desired order
          // and check if there's a blank line before it in the source
          const firstValueIdx = desired.findIndex(i => i.type === 'value')
          if (firstValueIdx >= 0) {
            const prevImport = desired[firstValueIdx - 1]
            const currentImport = desired[firstValueIdx]
            // Check if there's a blank line between them in the original text
            const betweenText = sourceCode.text.slice(
              prevImport.range[1],
              currentImport.range[0],
            )
            // A blank line means two consecutive newlines
            if (!betweenText.includes('\n\n') && !betweenText.includes('\n\r\n')) {
              needsBlankLine = true
            }
          }
        }

        if (!needsSort && !needsBlankLine) return

        // Report: either on the first out-of-order import, or at the boundary
        if (needsSort) {
          const firstMismatch = desired.find((imp, i) => imp.node !== imports[i].node)
          if (firstMismatch) {
            context.report({
              node: firstMismatch.node,
              messageId: 'unsorted',
              fix(fixer) {
                return buildFix(
                  fixer,
                  sourceCode,
                  imports,
                  desired,
                  blankLineBetweenGroups,
                )
              },
            })
          }
        }
        else if (needsBlankLine) {
          // Only blank line needed — report on the boundary
          const firstValueIdx = desired.findIndex(i => i.type === 'value')
          context.report({
            node: desired[firstValueIdx].node,
            messageId: 'groupSeparation',
            fix(fixer) {
              return buildFix(
                fixer,
                sourceCode,
                imports,
                desired,
                blankLineBetweenGroups,
              )
            },
          })
        }
      },
    }
  },
}

function buildFix(
  fixer: Rule.RuleFixer,
  sourceCode: SourceCode,
  original: ImportInfo[],
  sorted: ImportInfo[],
  blankLineBetweenGroups: boolean,
) {
  if (sorted.length === 0) return null

  // Get the leading whitespace (indentation + preceding blank lines) from the first import
  const first = original[0]
  const last = original[original.length - 1]
  if (!first || !last) return null
  const firstRange = first.range
  const lastRange = last.range

  // Build the sorted text block
  const lines: string[] = []
  let prevType: 'type' | 'value' | null = null

  for (const imp of sorted) {
    if (
      blankLineBetweenGroups
      && prevType === 'type'
      && imp.type === 'value'
      && lines.length > 0
    ) {
      lines.push('')
    }

    // Preserve original indentation
    const ownLine = sourceCode.text.slice(
      sourceCode.text.lastIndexOf('\n', imp.range[0]) + 1,
      imp.range[0],
    )
    lines.push(ownLine + imp.text)
    prevType = imp.type
  }

  // Find the trailing newline after the last import to preserve it
  const textAfterLast = sourceCode.text.slice(lastRange[1])
  const firstNewlineAfter = textAfterLast.indexOf('\n')
  const trailingContent
    = firstNewlineAfter >= 0
      ? textAfterLast.slice(0, firstNewlineAfter + 1)
      : textAfterLast

  const replacement = lines.join('\n') + trailingContent

  return fixer.replaceTextRange(
    [firstRange[0], lastRange[1] + (firstNewlineAfter >= 0 ? firstNewlineAfter + 1 : 0)],
    replacement,
  )
}

export default sortImportsByLength
