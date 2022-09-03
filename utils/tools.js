import { ethers } from 'ethers';

const convertBigNumberToNumber = (value) => {
  const decimals = 18;
  return Math.round(Number(ethers.utils.formatEther(value)) * 10 ** decimals);
}

export {
  convertBigNumberToNumber
}