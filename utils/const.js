import { ethers } from "ethers";
import registryAbi from 'utils/contracts/Registry.sol/Registry.json';
import tokenAbi from 'utils/contracts/EnergyToken.sol/EnergyToken.json';
import poolmarketAbi from 'utils/contracts/PoolMarket.sol/PoolMarket.json';
import paymentAbi from 'utils/contracts/Payment.sol/Payment.json';

// Update the chainId to 5 when switching to Goerli testnet
var chainId = 1337;
var backendUrl = 'http://localhost:3000/';

var rpcUrl = 'http://192.168.226.22:8545';
// var rpcUrl = 'ws://192.168.226.22:8546';
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
var TOKEN_CONTRACT_ADDRESS = '0xF12b5dd4EAD5F743C6BaA640B0216200e89B60Da'
var REGISTRY_CONTRACT_ADDRESS = '0x345cA3e014Aaf5dcA488057592ee47305D9B3e10'
var POOLMARKET_CONTRACT_ADDRESS = '0xf25186B5081Ff5cE73482AD761DB0eB0d25abfBF'
var PAYMENT_CONTRACT_ADDRESS = '0x8f0483125FCb9aaAEFA9209D8E9d7b9C8B9Fb90F'

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

// const registryContractRead = new ethers.Contract(REGISTRY_CONTRACT_ADDRESS, registryAbi, defaultProvider)
const tokenContractRead = new ethers.Contract(TOKEN_CONTRACT_ADDRESS, tokenAbi, defaultProvider)
// const poolmarketContractRead = new ethers.Contract(POOLMARKET_CONTRACT_ADDRESS, poolmarketAbi, defaultProvider)
// const paymentContractRead = new ethers.Contract(PAYMENT_CONTRACT_ADDRESS, paymentAbi, defaultProvider)

const ipfsEndpoint = 'https://gateway.pinata.cloud/ipfs/';
const GAS_LIMIT = 0.0075 * 10 ** chainConfig[0].nativeCurrency.decimals;

export {
  REGISTRY_CONTRACT_ADDRESS,
  TOKEN_CONTRACT_ADDRESS,
  POOLMARKET_CONTRACT_ADDRESS,
  PAYMENT_CONTRACT_ADDRESS,
  // registryContractRead,
  tokenContractRead,
  // poolmarketContractRead,
  // paymentContractRead,
  rpcUrl,
  backendUrl,
  defaultProvider,
  defaultNetworkId,
  chainConfig,
  ipfsEndpoint,
  GAS_LIMIT
}