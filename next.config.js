/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  images: {
    domains: ['api.ipfsbrowser.com', 'gateway.pinata.cloud'],
  },
}
module.exports = nextConfig
