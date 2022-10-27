import { ethers } from "ethers";

// Update the chainId to 5 when switching to Goerli testnet
var chainId = 1337;
var backendUrl = 'http://localhost:3000/';

var rpcUrl = 'http://192.168.226.35:8545';
// var rpcUrl = 'ws://192.168.226.35:8546';
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
var TOKEN_CONTRACT_ADDRESS = '0x9eC42BEC54075b8Ac43a4702Ad8F8f8e9B69Dd64'
var REGISTRY_CONTRACT_ADDRESS = '0x3fe4bACDd17EC8AAc34e17d86b24bd89748947D9'
var POOLMARKET_CONTRACT_ADDRESS = '0x64e465Ae4FF1a0502DCD40FE1531bbB740623143'
var PAYMENT_CONTRACT_ADDRESS = '0x924ff50C98db11D790cc0938648dfC8399cA306e'

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
  TOKEN_CONTRACT_ADDRESS = '0x0519C952F4825ba7050F0cAB86131A580474Ea2e';
  REGISTRY_CONTRACT_ADDRESS = '0x2E5Cdd26af7E5d0ABB9CF3721Cf988dFf42B20a4';
  POOLMARKET_CONTRACT_ADDRESS = '0xA94f586cB8A023Bb43eE96E38dE24608fF890AFC';
  PAYMENT_CONTRACT_ADDRESS = '0x025301790aDb4fAfa7C79128a2156eA0D1A6c078';
}
const defaultProvider = new ethers.providers.JsonRpcProvider(rpcUrl);

const ipfsEndpoint = 'https://gateway.pinata.cloud/ipfs/';
const GAS_LIMIT = 0.0075 * 10 ** chainConfig[0].nativeCurrency.decimals;

export {
  REGISTRY_CONTRACT_ADDRESS,
  TOKEN_CONTRACT_ADDRESS,
  POOLMARKET_CONTRACT_ADDRESS,
  PAYMENT_CONTRACT_ADDRESS,
  rpcUrl,
  backendUrl,
  defaultProvider,
  defaultNetworkId,
  chainConfig,
  ipfsEndpoint,
  GAS_LIMIT
}