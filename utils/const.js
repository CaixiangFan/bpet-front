import { ethers } from "ethers";
import registryAbi from 'utils/contracts/Registry.sol/Registry.json';
import tokenAbi from 'utils/contracts/EnergyToken.sol/EnergyToken.json';
import poolmarketAbi from 'utils/contracts/PoolMarket.sol/PoolMarket.json';
import paymentAbi from 'utils/contracts/Payment.sol/Payment.json';

// const backendUrl = 'http://localhost:3000/'
const backendUrl = 'https://nfticket.herokuapp.com/'
// RPC URL -- replaced with bsctestnet
// const besuRpcUrl = 'http://192.168.226.67:8545';
// const defaultProvider = new ethers.providers.JsonRpcProvider(besuRpcUrl);
// const defaultNetworkId = 1337;

const besuRpcUrl = 'https://eth-goerli.alchemyapi.io/v2/clmX3XYJBsntbfU05Td00zsij5-rcKqQ';
const defaultProvider = new ethers.providers.JsonRpcProvider(besuRpcUrl);
const defaultNetworkId = 5;

const TOKEN_CONTRACT_ADDRESS = '0x0519C952F4825ba7050F0cAB86131A580474Ea2e';
const REGISTRY_CONTRACT_ADDRESS = '0x2E5Cdd26af7E5d0ABB9CF3721Cf988dFf42B20a4';
const POOLMARKET_CONTRACT_ADDRESS = '0x09c70DCe1aEbca6cbc5f628DeE19c331fb53B9C6';
const PAYMENT_CONTRACT_ADDRESS = '0x025301790aDb4fAfa7C79128a2156eA0D1A6c078';

const registryContractRead = new ethers.Contract(REGISTRY_CONTRACT_ADDRESS, registryAbi, defaultProvider)
const tokenContractRead = new ethers.Contract(TOKEN_CONTRACT_ADDRESS, tokenAbi, defaultProvider)
const poolmarketContractRead = new ethers.Contract(POOLMARKET_CONTRACT_ADDRESS, poolmarketAbi, defaultProvider)
const paymentContractRead = new ethers.Contract(PAYMENT_CONTRACT_ADDRESS, paymentAbi, defaultProvider)

const besuChainConfig = [
  {
    chainId: '0x5',
    rpcUrls: [besuRpcUrl,],
    chainName: 'Goerli',
    nativeCurrency: {
      name: 'Goerli Ether',
      symbol: 'GoerliETH',
      decimals: 18,
    },
    blockExplorerUrls: ['https://goerli.etherscan.io/'],
  },
]

const ipfsEndpoint = 'https://gateway.pinata.cloud/ipfs/'


export {
  backendUrl,
  REGISTRY_CONTRACT_ADDRESS,
  TOKEN_CONTRACT_ADDRESS,
  POOLMARKET_CONTRACT_ADDRESS,
  PAYMENT_CONTRACT_ADDRESS,
  registryContractRead,
  tokenContractRead,
  poolmarketContractRead,
  paymentContractRead,
  besuRpcUrl,
  defaultProvider,
  defaultNetworkId,
  besuChainConfig,
  ipfsEndpoint
}