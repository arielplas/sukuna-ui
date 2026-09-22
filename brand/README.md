# sukuna-ui — brand kit

Dark, premium, restrained. One crimson, reserved for the single most important element in any composition.

## Mark: "Ember Gate"
A flame silhouette with an arched doorway cut from its base — a shrine gate standing inside its own fire.
Single path on a 24-unit grid, `fill-rule="evenodd"`, 269 bytes. Flat colour only below 48 px; the
crimson→maroon gradient (`#D8253A → #B01221`, 135°) is for hero sizes.

## Lockup rules
- Mark height = 0.84 × wordmark size, bottom of the mark sits on the wordmark baseline; gap = 0.26 × wordmark size.
- Clear space on every side = the x-height of the wordmark (the height of the "u"). Every lockup SVG already includes it.
- Minimum sizes: mark alone 16 px; horizontal lockup 120 px wide; stacked lockup 96 px wide. Below that, use the mark only.
- Never recolour the mark in anything but the tokens below; never add a second hue "for fire".

## Tokens
Dark (default): bg `#0A0A0B` · surface `#141416` · surface-2 `#1C1C20` · well `#000000` · accent `#FF3B4E` ·
accent-deep `#B01221` · text `#F4F1EC` · text-dim `#9A948A` · premium `#E8DCC4` · premium-dim `#B5A98C`
Light: bg `#FAF9F5` · surface `#FFFFFF` · accent `#D8253A` · accent-deep `#9A0E1C` · text `#141413` · premium `#786A4A`

## Contrast (WCAG, checked programmatically)
- `#F4F1EC` on `#0A0A0B` — 17.6:1 (wordmark, social)
- `#9A948A` on `#0A0A0B` — 6.6:1 (taglines)
- `#B5A98C` on `#0A0A0B` — 8.5:1 (eyebrows)
- `#FF3B4E` on `#0A0A0B` — 5.6:1 (mark; never used for running text)
- `#141413` on `#FAF9F5` — 17.5:1 · `#786A4A` on `#FAF9F5` — 5.0:1 · `#D8253A` on `#FAF9F5` — 4.7:1

See ASSETS.md for every file, its size and where it is used.
