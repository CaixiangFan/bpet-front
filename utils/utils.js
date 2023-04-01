import { ethers, BigNumber } from "ethers";

// Update the chainId to 5 when switching to Goerli testnet
var chainId = 1337;
var backendUrl = process.env.BACKEND_URL;

var rpcUrl = process.env.RPC_URL;
// var rpcUrl = 'ws://192.168.226.33:8546';
var defaultNetworkId = 1337;
var chainConfig = [
  {
    chainId: '0x539',
    rpcUrls: [rpcUrl,],
    chainName: 'Besu',
    nativeCurrency: {
      name: 'Besu Ether',
      symbol: 'BesuETH',
      decimals: 18,
    },
  },
]

// Contracts on Besu
var TOKEN_CONTRACT_ADDRESS = process.env.TOKEN_CONTRACT_ADDRESS;
var REGISTRY_CONTRACT_ADDRESS = process.env.REGISTRY_CONTRACT_ADDRESS;
var POOLMARKET_CONTRACT_ADDRESS = process.env.POOLMARKET_CONTRACT_ADDRESS;
var PAYMENT_CONTRACT_ADDRESS = process.env.PAYMENT_CONTRACT_ADDRESS;
if (chainId === 5) {
  rpcUrl = 'https://eth-goerli.alchemyapi.io/v2/clmX3XYJBsntbfU05Td00zsij5-rcKqQ';
  defaultNetworkId = 5;
  chainConfig = [
    {
      chainId: '0x5',
      rpcUrls: [rpcUrl,],
      chainName: 'Goerli',
      nativeCurrency: {
        name: 'Goerli Ether',
        symbol: 'GoerliETH',
        decimals: 18,
      },
      blockExplorerUrls: ['https://goerli.etherscan.io/'],
    },
  ]

  // Contracts on Goerli
  TOKEN_CONTRACT_ADDRESS = process.env.GOERLI_TOKEN_CONTRACT_ADDRESS;
  REGISTRY_CONTRACT_ADDRESS = process.env.GOERLI_REGISTRY_CONTRACT_ADDRESS;
  POOLMARKET_CONTRACT_ADDRESS = process.env.GOERLI_POOLMARKET_CONTRACT_ADDRESS;
  PAYMENT_CONTRACT_ADDRESS = process.env.GOERLI_PAYMENT_CONTRACT_ADDRESS;
}
const defaultProvider = new ethers.providers.JsonRpcProvider(rpcUrl);

const ipfsEndpoint = 'https://gateway.pinata.cloud/ipfs/';
const GAS_LIMIT = 0.0075 * 10 ** chainConfig[0].nativeCurrency.decimals;

const convertBigNumberToNumber = (value) => {
  const decimals = 18;
  return Math.round(Number(ethers.utils.formatEther(value)) * 10 ** decimals);
}

const convertToBigNumber = (value) => {
  const decimals = 18;
  return BigNumber.from(String(value * 10 ** decimals));
}


export {
  REGISTRY_CONTRACT_ADDRESS,
  TOKEN_CONTRACT_ADDRESS,
  POOLMARKET_CONTRACT_ADDRESS,
  PAYMENT_CONTRACT_ADDRESS,
  convertBigNumberToNumber,
  convertToBigNumber,
  rpcUrl,
  backendUrl,
  defaultProvider,
  defaultNetworkId,
  chainConfig,
  ipfsEndpoint,
  GAS_LIMIT
}