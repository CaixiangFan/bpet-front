import { ethers } from 'ethers';
import { besuChainConfig } from './const';

const convertBigNumberToNumber = (value) => {
  const decimals = besuChainConfig[0].nativeCurrency.decimals;
  return Math.round(Number(ethers.utils.formatEther(value)) * 10 ** decimals);
}

export {
  convertBigNumberToNumber
}