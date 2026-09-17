# Component: Toast

> Follows the `docs/component-button.md` template. `'use client'` — headless-backed (Base UI
> `toast`). Provider + hook shape, not a single element.

## 1. Purpose

Transient notifications. Wrap the app in `ToastProvider`; call `useToast().toast(...)` to show one.

## 2. Files

```
src/components/toast/
├── toast.styles.tsx   # tv() slots: viewport, root, title, description, close.
├── toast.logic.tsx    # 'use client'; ToastProvider + useToast + internal ToastList.
├── toast.test.tsx
├── toast.stories.tsx
└── index.tsx
test/browser/toast.test.ts  # Playwright: show + auto-render
```

## 3. API

```ts
export interface ToastProviderProps { children: ReactNode; timeout?: number; limit?: number }
export function ToastProvider(props: ToastProviderProps): JSX.Element

export interface ToastOptions { title?: ReactNode; description?: ReactNode; type?: string }
export function useToast(): { toast: (options: ToastOptions) => string }  // returns the toast id
```

Usage:

```tsx
<ToastProvider><App /></ToastProvider>
// inside App:
const { toast } = useToast()
toast({ title: 'Saved', description: 'Your changes were saved.' })
```

## 4. Variants → tokens

viewport: `fixed bottom-4 right-4 z-50 flex w-80 flex-col gap-2`. root: `rounded-md border border-line bg-surface p-4 shadow-card` + enter/exit slide/opacity. title `font-display font-bold text-sm`; description `text-sm text-text-dim`; close: top-right ghost button.

## 5. States

enter (slide/fade in) · visible · auto-dismiss after `timeout` · close (button/swipe from Base UI).

## 6. Logic (`toast.logic.tsx`)

- `'use client'`. `ToastProvider` renders `Base.Provider` → children → `Base.Portal` → `Base.Viewport`
  → `ToastList`. `ToastList` maps `useToastManager().toasts` to `Base.Root` (+ Title/Description/Close,
  which read the toast from context). `useToast` wraps `manager.add`.

## 7. Styles (`toast.styles.tsx`)

`tv()` `slots` (no variants).

## 8. Accessibility checklist

- [ ] Viewport is a labelled region; toasts announce politely (Base UI live region).
- [ ] Close button has `aria-label`; Escape/close supported.
- [ ] Auto-dismiss pauses on hover/focus (Base UI).

## 9. Tests

**Unit:** a component using `useToast` shows a toast on click (title + description render); Close
removes it. **Browser:** clicking a trigger shows the toast.

## 10. Stories

`Default` (a Show button inside a provider), `WithDescription`.

## 11. Decisions

- Provider + `useToast` hook API (not a rendered element); string values via `type` for styling
  hooks. No per-toast action button in v1 (Base UI supports it; can add).
