import type { ReactElement } from 'react'
import { hydrateRoot } from 'react-dom/client'
import { renderToString } from 'react-dom/server'

/** Render an element to an HTML string on the server. */
export const renderServer = (el: ReactElement) => renderToString(el)

/** Renders on the server, hydrates on the client, and fails on any hydration warning. */
export const expectHydrates = async (el: ReactElement) => {
  const html = renderToString(el)
  const host = document.createElement('div')
  host.innerHTML = html
  document.body.appendChild(host)
  const errors: string[] = []
  const orig = console.error
  console.error = (...a: unknown[]) => {
    errors.push(a.join(' '))
  }
  try {
    await new Promise<void>((resolve) => {
      hydrateRoot(host, el)
      queueMicrotask(resolve)
    })
  } finally {
    console.error = orig
    host.remove()
  }
  if (errors.some((e) => /hydrat/i.test(e))) throw new Error(errors.join('\n'))
}
