/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['pic.maizuo.com'],
  },
}

module.exports = nextConfig
