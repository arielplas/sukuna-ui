import type { ReactNode } from 'react'

/**
 * A tiny, dependency-free TSX highlighter for the "Show code" snippets. It is not a full parser —
 * just enough of a mode stack (JS ⇄ JSX tag ⇄ JSX text) that tag names, attributes, strings and
 * keywords get VS Code–style colours, and apostrophes in JSX text don't start a "string".
 * Colours live in `styles.css` as `.tok-*` classes, themed for dark and light.
 */

type Kind =
  | 'comment'
  | 'string'
  | 'number'
  | 'keyword'
  | 'control'
  | 'component'
  | 'tag'
  | 'attr'
  | 'fn'
  | 'punct'
  | 'plain'
type Token = { kind: Kind; value: string }
type Mode = 'js' | 'tag' | 'close' | 'text'

const CONTROL = new Set([
  'import',
  'export',
  'from',
  'return',
  'if',
  'else',
  'for',
  'while',
  'switch',
  'case',
  'break',
  'await',
  'async',
  'default',
  'try',
  'catch',
])
const KEYWORD = new Set([
  'const',
  'let',
  'var',
  'function',
  'new',
  'typeof',
  'as',
  'type',
  'interface',
  'true',
  'false',
  'null',
  'undefined',
  'this',
  'void',
  'of',
  'in',
])

const IDENT = /^[A-Za-z_$][\w$]*/
const JSX_NAME = /^[A-Za-z_$][\w$.:-]*/

export function tokenize(src: string): Token[] {
  const out: Token[] = []
  const stack: Mode[] = ['js']
  let i = 0
  const top = () => stack[stack.length - 1]
  const push = (kind: Kind, value: string) => {
    const last = out[out.length - 1]
    if (last && last.kind === kind) last.value += value
    else out.push({ kind, value })
    i += value.length
  }
  const nameKind = (name: string): Kind => (/^[A-Z]/.test(name) ? 'component' : 'tag')
  /** Previous non-whitespace token, used to tell `a < b` from `<Tag`. */
  const prevSignificant = () => {
    for (let k = out.length - 1; k >= 0; k--) {
      const tk = out[k] as Token
      if (tk.value.trim()) return tk
    }
    return undefined
  }
  const startsJsx = (rest: string) => {
    if (!/^<([A-Za-z]|>)/.test(rest)) return false
    const prev = prevSignificant()
    if (!prev || out[out.length - 1]?.value.includes('\n')) return true
    if (prev.kind === 'punct') return !/[)\]]$/.test(prev.value.trim())
    return prev.kind === 'control' || prev.kind === 'keyword'
  }
  const openTag = (rest: string) => {
    if (rest.startsWith('<>')) {
      push('punct', '<>')
      stack.push('text')
      return
    }
    push('punct', '<')
    const name = JSX_NAME.exec(rest.slice(1))?.[0] ?? ''
    push(nameKind(name), name)
    stack.push('tag')
  }

  while (i < src.length) {
    const rest = src.slice(i)
    const mode = top()

    if (mode === 'text') {
      if (rest.startsWith('</')) {
        push('punct', '</')
        const name = JSX_NAME.exec(src.slice(i))?.[0] ?? ''
        if (name) push(nameKind(name), name)
        stack.pop()
        stack.push('close')
      } else if (rest[0] === '<') openTag(rest)
      else if (rest[0] === '{') {
        push('punct', '{')
        stack.push('js')
      } else push('plain', /^[^<{]+/.exec(rest)?.[0] ?? (rest[0] as string))
      continue
    }

    /** Pushes the regex's match at the cursor as `kind`; false (and no-op) if it doesn't match. */
    const take = (re: RegExp, kind: Kind) => {
      const hit = re.exec(rest)?.[0]
      if (hit) push(kind, hit)
      return Boolean(hit)
    }

    if (mode === 'tag' || mode === 'close') {
      if (take(/^\s+/, 'plain')) continue
      if (rest.startsWith('/>')) {
        push('punct', '/>')
        stack.pop()
      } else if (rest[0] === '>') {
        push('punct', '>')
        stack.pop()
        if (mode === 'tag') stack.push('text')
      } else if (rest[0] === '{') {
        push('punct', '{')
        stack.push('js')
      } else if (!take(/^("[^"]*"|'[^']*')/, 'string') && !take(/^[\w$-]+/, 'attr'))
        push('punct', rest[0] as string)
      continue
    }

    // mode === 'js'
    if (
      take(/^\s+/, 'plain') ||
      take(/^\/\/[^\n]*/, 'comment') ||
      take(/^\/\*[\s\S]*?(\*\/|$)/, 'comment') ||
      take(/^("(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*'|`(?:\\.|[^`\\])*`)/, 'string') ||
      take(/^\d[\d_]*(\.\d+)?/, 'number')
    )
      continue
    const word = IDENT.exec(rest)?.[0]
    if (startsJsx(rest)) openTag(rest)
    else if (word) {
      const after = src.slice(i + word.length)
      if (CONTROL.has(word)) push('control', word)
      else if (KEYWORD.has(word)) push('keyword', word)
      else if (/^\s*\(/.test(after)) push('fn', word)
      else if (/^[A-Z]/.test(word)) push('component', word)
      else push('plain', word)
    } else if (rest[0] === '{') {
      push('punct', '{')
      stack.push('js')
    } else if (rest[0] === '}') {
      push('punct', '}')
      if (stack.length > 1) stack.pop()
    } else push('punct', rest[0] as string)
  }
  return out
}

/** Renders `src` as coloured spans; drop it inside a `<code>`. */
export function Highlight({ code }: { code: string }): ReactNode {
  return tokenize(code).map((tk, n) =>
    tk.kind === 'plain' ? (
      tk.value
    ) : (
      // biome-ignore lint/suspicious/noArrayIndexKey: tokens are a static, positional list
      <span key={n} className={`tok-${tk.kind}`}>
        {tk.value}
      </span>
    ),
  )
}
