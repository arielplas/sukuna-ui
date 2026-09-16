import { preserveDirectivesPlugin } from 'esbuild-plugin-preserve-directives'
import { defineConfig } from 'tsup'

// Zero-runtime library build. React is never bundled (peer dep).
// `preserveDirectives` keeps the `'use client'` banner on components that
// declare it, so RSC consumers see the directive per-file after bundling.
export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  treeshake: true,
  splitting: true,
  sourcemap: true,
  clean: true,
  external: ['react', 'react-dom', 'react/jsx-runtime'],
  esbuildPlugins: [
    preserveDirectivesPlugin({
      directives: ['use client', 'use server'],
      include: /\.(js|ts|jsx|tsx)$/,
      exclude: /node_modules/,
    }),
  ],
})
