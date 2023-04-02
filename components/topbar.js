import React, { useState, useEffect, useContext } from 'react';
import Link from 'next/link'
import { useRouter } from 'next/router'
import Web3Modal from 'web3modal';
import dynamic from 'next/dynamic';
import { ethers } from 'ethers';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import { useSnackbar } from 'notistack';
import { Store } from "utils/Store";
import { defaultNetworkId, backendUrl, besuChainConfig } from 'utils/utils';
import axios from 'axios';

const pages = ['I\'m Admin', 'Register', 'Buy ETK', 'Submit Offer', 'Submit Bid'];
const pages_link = ['/admin', '/register', '/buy-etk', '/submit-offer', '/submit-bid'];

const ResponsiveAppBar = () => {
  const { state, dispatch } = useContext(Store);

  const router = useRouter()
  const { walletConencted, correctNetworkConnected, account, provider, signer } = state;

  const [anchorElNav, setAnchorElNav] = useState(null);

  // Web3 Integration
  const web3Modal = new Web3Modal({ network: 'mainnet', cacheProvider: true })

  const resetState = () => {
    dispatch({ type: 'RESET_ACCOUNT' });
    dispatch({ type: 'RESET_PROVIDER' });
    dispatch({ type: 'RESET_SIGNER' });
    dispatch({ type: 'RESET_NETWORK' });
    console.log('STATE RESETTED ...');
  };

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

  // On Page Load
  useEffect(() => {
    // unlock wallet
    const init = async () => {
      const _ownerAddress = await axios.get(`/api/registry/getOwnerAddress`);
      dispatch({ type: 'UPDATE_ADMIN_ADDRESS', payload: _ownerAddress.data });
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      // connectWallet
      connectWallet();

      // Listen to network changes
      if (window.ethereum) {
        window.ethereum.on('chainChanged', () => {
          updateNetwork('connect');
        });
        window.ethereum.on('accountsChanged', (account) => {
          connectWallet();
        });
      }
    };
    init();
  }, []);



  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="#!"
            onClick={() => router.push('/')}
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'Arial',
              fontWeight: 700,
              letterSpacing: '.1rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            BPET
          </Typography>
          
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page, i) => (
              <Button
                key={page}
                onClick={() => { router.push(pages_link[i]) }}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                {page}
              </Button>
            ))}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            {
              walletConencted ? (
                <Button variant="contained" onClick={disconnectWallet}>{account.substring(0, 6) + '....' + account.slice(-4)}</Button>
              ) :
                (<Button variant="contained" onClick={connectWallet}>Connect Wallet</Button>
                )
            }
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default dynamic(() => Promise.resolve(ResponsiveAppBar), { ssr: false });