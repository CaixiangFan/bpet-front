import React, { useContext, useState, useEffect } from 'react';
import Layout from 'components/layout';
import { ethers } from "ethers";
import ElectricBoltIcon from '@mui/icons-material/ElectricBolt';
import { POOLMARKET_CONTRACT_ADDRESS, backendUrl } from 'utils/utils';
import poolmarketAbi from 'utils/contracts/PoolMarket.sol/PoolMarket.json'
import { useSnackbar, closeSnackbar } from 'notistack';
import { Store } from "utils/Store";
import {
    Avatar,
    Button,
    FormControlLabel,
    TextField,
    CssBaseline,
    Container,
    Typography,
    Checkbox,
    Grid,
    Box
  } from '@mui/material';
import axios from "axios";
import { waitUntilSymbol } from 'next/dist/server/web/spec-compliant/fetch-event';

const SubmitOffer = () => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const { state, dispatch } = useContext(Store);
  const { walletConencted, correctNetworkConnected, account, provider, signer } = state;
  const poolmarketContractWrite = new ethers.Contract(POOLMARKET_CONTRACT_ADDRESS, poolmarketAbi.abi, signer);
  const [assetId, setAssetId] = useState('');
  const [blockAmount, setBlockAmount] = useState(0);
  const [capacity, setCapacity] = useState(0);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);
  const [isRegisteredSupplier, setIsRegisteredSupplier] = useState(false);
  const [agreedCondition, setAgreedCondition] = useState(true);

  useEffect(() => {
    if (account.length === 0) return
    const checkRegistered = async () => {
      const _isRegisteredSupplierRes = await axios.get(`/api/registry/isregisteredsupplier/${account}`);
      const _isRegisteredSupplier = _isRegisteredSupplierRes.data;
      console.log('registered supplier: ', _isRegisteredSupplier);
      if (_isRegisteredSupplier) {
        const registeredSupplierRes = await axios.get(`/api/registry/getsupplier/${account}`);
        const registeredSupplier = registeredSupplierRes.data;
        const minmaxPricesRes = await axios.get(`/api/poolmarket/getMinMaxPrices`);
        const minmaxPrices = minmaxPricesRes.data;
        setAssetId(registeredSupplier.assetId);
        setBlockAmount(registeredSupplier.blockAmount);
        setCapacity(registeredSupplier.capacity);
        setMinPrice(minmaxPrices.min);
        setMaxPrice(minmaxPrices.max);
      } else {
        enqueueSnackbar('This account has not been registered as supplier!', { variant: 'info', preventDuplicate: true});
      }
      setIsRegisteredSupplier(_isRegisteredSupplier);
    }
    checkRegistered();
  }, [account])

  const inputValidate = (offerData) => {
    let allValid = true;
    //check empty inputs
    if (offerData.energyAmount.length === 0) {
      allValid = false;
      enqueueSnackbar('You must input an amount', { variant: 'error' })
    }

    if (offerData.blockNumber.length === 0) {
      allValid = false;
      enqueueSnackbar('You must input a block number', { variant: 'error' })
    }

    if (offerData.price.length === 0) {
      allValid = false;
      enqueueSnackbar('You must input a price', { variant: 'error' })
    }

    if (Number(offerData.energyAmount) <= 0 || Number(offerData.energyAmount) > capacity) {
      allValid = false;
      enqueueSnackbar('You must input a positive amount within capacity', { variant: 'error' })
    }

    if (Number(offerData.blockNumber) < 0 || Number(offerData.blockNumber) >= blockAmount) {
      allValid = false;
      enqueueSnackbar('You must input a block number within block amount', { variant: 'error' })
    }

    if (Number(offerData.price) < minPrice || Number(offerData.price) > maxPrice) {
      allValid = false;
      enqueueSnackbar(`You must input a price between ${minPrice} and ${maxPrice}`, { variant: 'error' })
    }
    return allValid;
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const offerData = {
      assetID: assetId,
      energyAmount: data.get('amount'),
      blockNumber: data.get('blockNumber'),
      price: data.get('price')
    };
    const valid = inputValidate(offerData);
    if (!valid) return;

    if (!walletConencted || !signer) {
      enqueueSnackbar("You must login Metamask to continue", { variant: 'info', preventDuplicate: true});
      return
    }
    const submitAnOffer = async (offerData) => {
      await submitOffer(offerData);
    }
    submitAnOffer(offerData);
  };

  const submitOffer = async (data) => {
    try {
      const tx = await poolmarketContractWrite.submitOffer(
        Number(data.blockNumber),
        Number(data.energyAmount),
        Number(data.price)
      );
      const receipt = await tx.wait(1);
      if (receipt.status == 1) {
        enqueueSnackbar("You submitted an offer successfully!", { variant: 'success', preventDuplicate: true});
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleAgreedCondition = () => {
    setAgreedCondition(!agreedCondition);
  }

  return <Layout title='SubmitOffer'>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <ElectricBoltIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Submit An Energy Offer
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>

              <Grid item xs={12} sm={12}>
                <TextField
                  autoComplete="AssetID"
                  name="assetID"
                  required
                  fullWidth
                  id="assetID"
                  label={isRegisteredSupplier ? assetId : 'AssetId'}                 
                  disabled={isRegisteredSupplier}
                />
              </Grid>
              <Grid item xs={12} sm={12}>
                <TextField
                  required
                  fullWidth
                  autoFocus
                  id="amount"
                  label={isRegisteredSupplier ? `Amount 0 ~ ${capacity}` : 'Amount'}
                  name="amount"
                  autoComplete="amount"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="blockNumber"
                  label={isRegisteredSupplier ? `Block Number 0 ~ ${blockAmount - 1}` : 'Block Number'}
                  name="blockNumber"
                  autoComplete="blockNumber"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  name="price"
                  label={isRegisteredSupplier ? `Price ${minPrice} ~ ${maxPrice}` : 'Price'}
                  type="price"
                  id="price"
                  autoComplete="price"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={<Checkbox value="agreeCondition" color="primary" onChange={handleAgreedCondition}/>}
                  label="I have read and understand the terms and conditions of the agreement to submit an offer."
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={(!isRegisteredSupplier) || agreedCondition}
            >
              Submit
            </Button>
          </Box>
        </Box>
      </Container>
  </Layout>
}

export default SubmitOffer