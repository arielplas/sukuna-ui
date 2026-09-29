/**
 * `tailwind-merge` config for the player's `tv()` maps.
 *
 * - `prefix: 'vp'`: every player utility is written `vp:<utility>` and compiled by the player's own
 *   prebuilt stylesheet (`@sukunagg/video/video.css`, Tailwind `prefix(vp)`), so its classes can
 *   never collide with the host app's. The prefix lets merge resolve conflicts between prefixed
 *   classes; a host's unprefixed classes pass through untouched.
 * - The theme's custom `text-*` font sizes (e.g. `text-md`, which Tailwind's default scale lacks)
 *   would otherwise be read as text-COLOR utilities and wrongly conflict with `text-text`,
 *   `text-text-dim`, etc. Declaring the font-size group with our size keys keeps `text-<size>` and
 *   `text-<color>` in separate conflict groups.
 *
 * The size list mirrors the `--text-*` sizes declared in `src/styles/video.css`; keep them in sync.
 */
import type { ConfigExtension, DefaultClassGroupIds, DefaultThemeGroupIds } from 'tailwind-merge'

const fontSizeKeys = ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl']

// Use the default class-group ids (which include `font-size`) so this config is assignable to
// `createTV`'s `twMergeConfig`.
export const twMergeConfig: ConfigExtension<DefaultClassGroupIds, DefaultThemeGroupIds> = {
  prefix: 'vp',
  extend: {
    classGroups: {
      'font-size': [{ text: fontSizeKeys }],
    },
  },
}
