import { ethers } from "ethers";
import abi from 'utils/contracts/abi.json'

// const backendUrl = 'http://localhost:3000/'
const backendUrl = 'https://nfticket.herokuapp.com/'
// RPC URL -- replaced with bsctestnet
const goerliRpcUrl = 'https://data-seed-prebsc-1-s1.binance.org:8545/';
const defaultProvider = new ethers.providers.JsonRpcProvider(goerliRpcUrl);
const defaultNetworkId = 97;

const contractAddress = '0xC6A396196d76DbDe3cB77B053886Ee603e274318'
const contractRead = new ethers.Contract(contractAddress, abi, defaultProvider)

const goerliChainConfig = [
  {
    chainId: '0x61',
    rpcUrls: [goerliRpcUrl,],
    chainName: 'BSCTestnet Testnet',
    nativeCurrency: {
      name: 'tBNB',
      symbol: 'BNB',
      decimals: 18,
    },
    blockExplorerUrls: ['https://goerli.etherscan.io/'],
  },
]

const ipfsEndpoint = 'https://gateway.pinata.cloud/ipfs/'


export {
  backendUrl,
  contractAddress,
  contractRead,
  goerliRpcUrl,
  defaultProvider,
  defaultNetworkId,
  goerliChainConfig,
  ipfsEndpoint
}