import type { ReactNode } from 'react'
// Zero-config consumer path: one precompiled stylesheet, no Tailwind.
import 'sukuna-ui/styles.css'

export const metadata = {
  title: 'sukuna-ui — Next.js App Router',
}

// Server component (no 'use client'). Sets the Sukuna theme on <html>.
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" data-theme="dark">
      <body style={{ margin: 0, background: 'var(--sk-bg)' }}>{children}</body>
    </html>
  )
}
