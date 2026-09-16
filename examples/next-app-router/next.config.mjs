/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // The linked package ships ESM with extensionless relative imports; transpiling it lets Next's
  // bundler resolve them (and honor the per-file 'use client' banners).
  transpilePackages: ['sukuna-ui'],
}

export default nextConfig
