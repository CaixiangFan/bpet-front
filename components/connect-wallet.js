import React, { useEffect, useState, useContext } from 'react';
// import { useSnackbar } from 'notistack';
// import { SnackbarProvider, enqueueSnackbar } from 'notistack'
import Head from 'next/head';
import TopBar from './topbar';
import styles from './layout.module.css';
// import { Store } from "utils/Store";

const web3Modal = new Web3Modal({ network: 'mainnet', cacheProvider: true })

const resetState = () => {
  dispatch({ type: 'RESET_ACCOUNT' });
  dispatch({ type: 'RESET_PROVIDER' });
  dispatch({ type: 'RESET_SIGNER' });
  dispatch({ type: 'RESET_NETWORK' });
  console.log('STATE RESETTED ...');
};

// const updateAllTicketInfo = async () => {
//   let size = await contractRead.getTicketCategoryArraySize()
//   size = size.toNumber()
//   if (size === 0) {
//     enqueueSnackbar('Ticket Categories Not Set Yet!', { variant: 'error' })
//     return
//   }
//   let ticketCategories = []
//   for (let i = 0; i < size; i++) {
//     const ticket = await contractRead.ticketCategoryArray(i);
//     const categoryName = ethers.utils.parseBytes32String(ticket.categoryName)
//     const ticketDetails = await contractRead.ticketCategoryMapping(ticket.categoryName)
//     const ticketPrice = ethers.utils.formatEther(ticketDetails.ticketPrice)
//     const maxNoOfTickets = ticketDetails.maxNoOfTickets.toNumber()
//     const numberOfTicketsBought = ticketDetails.numberOfTicketsBought.toNumber()
//     // console.log(categoryName, ticketPrice, maxNoOfTickets, numberOfTicketsBought)
//     ticketCategories.push({ categoryName, ticketPrice, maxNoOfTickets, numberOfTicketsBought })
//   }
//   dispatch({ type: 'UPDATE_TICKET_CATEGORIES', payload: ticketCategories})
// }



const updateProvider = async () => {
  const connection = await web3Modal.connect();
  const _provider = new ethers.providers.Web3Provider(connection);
  dispatch({ type: 'UPDATE_PROVIDER', payload: _provider });
  return _provider;
};

const updateSigner = async () => {
  const connection = await web3Modal.connect();
  const _provider = new ethers.providers.Web3Provider(connection);
  const _signer = _provider.getSigner();
  dispatch({ type: 'UPDATE_SIGNER', payload: _signer });
  return _signer;
};

const updateAccount = async () => {
  const connection = await web3Modal.connect();
  const _provider = new ethers.providers.Web3Provider(connection);
  const accounts = await _provider.listAccounts();
  if (accounts) dispatch({ type: 'UPDATE_ACCOUNT', payload: accounts[0] });
  return accounts[0];
};

const updateNetwork = async (action) => {
  if (action === 'connect') {
    const connection = await web3Modal.connect();
    const _provider = new ethers.providers.Web3Provider(connection);
    const _network = await _provider.getNetwork();
    dispatch({ type: 'UPDATE_NETWORK', payload: _network });
    dispatch({ type: 'UPDATE_WALLET_CONNECTED', payload: true });
    if (_network.chainId !== defaultNetworkId) {
      dispatch({ type: 'UPDATE_CORRECT_NETWORK_CONNECTED', payload: false });
      // switch network
      window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: besuChainConfig,
      });
    } else {
      dispatch({ type: 'UPDATE_CORRECT_NETWORK_CONNECTED', payload: true });
    }
    return _network;
  }

  if (action === 'disconnect') {
    dispatch({ type: 'UPDATE_CORRECT_NETWORK_CONNECTED', payload: true });
    return;
  }
};

  const connectWallet = async () => {
    try {
      await updateProvider();
      await updateSigner();
      await updateAccount();
      await updateNetwork('connect');
    } catch (error) {
      console.error('connect wallet error: ', error);
      dispatch({ type: 'UPDATE_WALLET_CONNECTED', payload: false });
    }
  };

  const disconnectWallet = async () => {
    try {
      await web3Modal.clearCachedProvider();
      resetState();
      dispatch({ type: 'UPDATE_WALLET_CONNECTED', payload: false });
      updateNetwork('disconnect');
    } catch (error) {
      console.error('disconnect wallet error:', error);

    }
  };

const ConnectWallet = () => {

  return           
    <Box sx={{ flexGrow: 0 }}>
    {
      walletConencted ? (
        <Button variant="contained" onClick={disconnectWallet}>{account.substring(0, 6) + '....' + account.slice(-4)}</Button>
      ) :
        (<Button variant="contained" onClick={connectWallet}>Connect Wallet</Button>
        )
    }
    </Box>
}

export default ConnectWallet