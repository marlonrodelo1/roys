/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  transpilePackages: ['@roys/shared'],
};

module.exports = nextConfig;
