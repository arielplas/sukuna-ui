/**
 * Story registry for the explorer.
 *
 * Reads every `src/components/<name>/<name>.stories.tsx` at build time via `import.meta.glob` and
 * turns each CSF module into a { component → stories } entry the sidebar and detail view render.
 * Because we consume the stories (and the library) from source, the explorer always matches
 * Storybook — a new story shows up here automatically, no manual step.
 */
import type { ComponentType, ReactNode } from 'react'

/** The runtime shape of a CSF `default` export (Storybook `Meta`). Types from SB are erased. */
interface Meta {
  title?: string
  component?: ComponentType<Record<string, unknown>>
  args?: Record<string, unknown>
}

/** The runtime shape of a named CSF export (Storybook `StoryObj`). */
interface Story {
  render?: (args: Record<string, unknown>, ctx: unknown) => ReactNode
  args?: Record<string, unknown>
}

export interface StoryEntry {
  /** Export identifier, e.g. `WithDisabled`. */
  key: string
  /** Human label, e.g. `With Disabled`. */
  name: string
  story: Story
}

export interface ComponentEntry {
  /** Display name from `meta.title` (`Components/Button` → `Button`). */
  name: string
  /** URL hash slug, e.g. `button`. */
  slug: string
  meta: Meta
  stories: StoryEntry[]
}

const modules = import.meta.glob('../../../src/components/*/*.stories.tsx', {
  eager: true,
}) as Record<string, Record<string, unknown>>

const prettify = (key: string) =>
  key
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1 $2')
    .replace(/^./, (c) => c.toUpperCase())

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

export const components: ComponentEntry[] = Object.entries(modules)
  .map(([path, mod]): ComponentEntry => {
    const meta = (mod.default ?? {}) as Meta
    const name =
      meta.title?.split('/').pop()?.trim() ??
      // fallback: the folder name from the path
      path.split('/').at(-2) ??
      'Component'
    const stories = Object.entries(mod)
      .filter(([key, value]) => key !== 'default' && value !== null && typeof value === 'object')
      .map(([key, value]): StoryEntry => ({ key, name: prettify(key), story: value as Story }))
    return { name, slug: slugify(name), meta, stories }
  })
  .filter((c) => c.stories.length > 0)
  .sort((a, b) => a.name.localeCompare(b.name))

/** Render one story the way Storybook would: merge meta+story args, prefer an explicit `render`. */
export function renderStory(entry: ComponentEntry, item: StoryEntry): ReactNode {
  const args = { ...(entry.meta.args ?? {}), ...(item.story.args ?? {}) }
  if (typeof item.story.render === 'function') {
    return item.story.render(args, { args, globals: {}, parameters: {} })
  }
  const Component = entry.meta.component
  return Component ? <Component {...args} /> : null
}
