/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  images: {
    domains: ['api.ipfsbrowser.com', 'gateway.pinata.cloud'],
  },
  env: {
      TOKEN_CONTRACT_ADDRESS: process.env.TOKEN_CONTRACT_ADDRESS,
      REGISTRY_CONTRACT_ADDRESS: process.env.REGISTRY_CONTRACT_ADDRESS,
      POOLMARKET_CONTRACT_ADDRESS: process.env.POOLMARKET_CONTRACT_ADDRESS,
      PAYMENT_CONTRACT_ADDRESS: process.env.PAYMENT_CONTRACT_ADDRESS,
      BACKEND_URL: process.env.BACKEND_URL,
      RPC_URL: process.env.RPC_URL,
  }
}
module.exports = nextConfig
