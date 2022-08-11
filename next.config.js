/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['pic.maizuo.com', 'api.ipfsbrowser.com', 'gateway.pinata.cloud'],
  },
}

module.exports = nextConfig
