import { ethers } from 'ethers';
import { chainConfig } from './const';

const convertBigNumberToNumber = (value) => {
  const decimals = chainConfig[0].nativeCurrency.decimals;
  return Math.round(Number(ethers.utils.formatEther(value)) * 10 ** decimals);
}

const convertToBigNumber = (value) => {
  const bigNumber = ethers.BigNumber.from(value);
  return bigNumber;
}
export {
  convertBigNumberToNumber,
  convertToBigNumber
}