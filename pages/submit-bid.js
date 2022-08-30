import React, { useContext, useState, useEffect } from 'react';
import Layout from 'components/layout';
import { ethers } from "ethers";
import ElectricalServicesIcon from '@mui/icons-material/ElectricalServices';
import {
  registryContractRead, 
  REGISTRY_CONTRACT_ADDRESS,
  poolmarketContractRead,
  POOLMARKET_CONTRACT_ADDRESS
} from 'utils/const';
import poolmarketAbi from 'utils/contracts/PoolMarket.sol/PoolMarket.json'
import { useSnackbar, closeSnackbar } from 'notistack';
import { Store } from "utils/Store";
import {
    Avatar,
    Button,
    Select,
    MenuItem,
    FormControl,
    FormControlLabel,
    InputLabel,
    TextField,
    CssBaseline,
    Container,
    Typography,
    Checkbox,
    Link,
    Grid,
    Box
  } from '@mui/material';


const SubmitBid = () => {

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const { state, dispatch } = useContext(Store);
  const { walletConencted, correctNetworkConnected, account, provider, signer } = state;
  const [usertype, setUsertype] = useState('');
  const [assetId, setAssetId] = useState('');
  const [load, setLoad] = useState(0);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);
  const [isRegisteredConsumer, setIsRegisteredConsumer] = useState(false);

  useEffect(() => {
    if (account.length === 0) return
    const checkRegistered = async () => {
      const _isRegisteredConsumer = await registryContractRead.isRegisteredConsumer(account);
      if (_isRegisteredConsumer) {
        const registeredConsumer = await registryContractRead.getConsumer(account);
        const _minPrice = await poolmarketContractRead.minAllowedPrice();
        const _maxPrice = await poolmarketContractRead.maxAllowedPrice();
        setAssetId(registeredConsumer.assetId);
        // setBlockAmount(registeredConsumer.blockAmount);
        setLoad(registeredConsumer.load);
        setMinPrice(_minPrice);
        setMaxPrice(_maxPrice);
      } else {
        enqueueSnackbar('This account has not been registered as consumer!', { variant: 'info', preventDuplicate: true});
      }
      setIsRegisteredConsumer(_isRegisteredConsumer);
    }
    checkRegistered();
  }, [account])

  const inputValidate = (bidData) => {
    let allValid = true;
    //check empty inputs
    if (bidData.energyAmount.length === 0) {
      allValid = false;
      enqueueSnackbar('You must input an amount', { variant: 'error' })
    }

    if (bidData.price.length === 0) {
      allValid = false;
      enqueueSnackbar('You must input a price', { variant: 'error' })
    }

    if (Number(bidData.energyAmount) <= 0 || Number(bidData.energyAmount) > load) {
      allValid = false;
      enqueueSnackbar('You must input a positive amount within load', { variant: 'error' })
    }

    if (Number(bidData.price) < minPrice || Number(bidData.price) > maxPrice) {
      allValid = false;
      enqueueSnackbar(`You must input a price between ${minPrice} and ${maxPrice}`, { variant: 'error' })
    }
    return allValid;
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const bidData = {
      assetID: assetId,
      energyAmount: data.get('amount'),
      price: data.get('price')
    };
    const valid = inputValidate(bidData);
    if (!valid) return;

    if (!walletConencted || !signer) {
      enqueueSnackbar("You must login Metamask to continue", { variant: 'info', preventDuplicate: true});
      return
    }
    const submitABid = async (bidData) => {
      await submitBid(bidData);
      enqueueSnackbar("You submitted an offer successfully!", { variant: 'success', preventDuplicate: true});
    }
    submitABid(bidData);
  };

  const submitBid = async (data) => {
    try {
      const poolmarketContractWrite = new ethers.Contract(POOLMARKET_CONTRACT_ADDRESS, poolmarketAbi, signer);
      await poolmarketContractWrite.submitBid(
        data.assetID,
        Number(data.energyAmount),
        Number(data.price)
      );
    } catch (err) {
      console.log(err);
    }
  }

  return <Layout title='SubmitBid'>
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
            <ElectricalServicesIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Submit An Energy Bid
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
                  label={isRegisteredConsumer ? assetId : 'AssetID'}
                  disabled={isRegisteredConsumer}
                />
              </Grid>
              <Grid item xs={12} sm={12}>
                <TextField
                  required
                  fullWidth
                  autoFocus
                  id="amount"
                  label={isRegisteredConsumer ? `Amount 0 ~ ${load}` : 'Amount'}
                  name="amount"
                  autoComplete="amount"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="price"
                  label={isRegisteredConsumer ? `Price ${minPrice} ~ ${maxPrice}` : 'Price'}
                  name="price"
                  autoComplete="price"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={<Checkbox value="allowExtraEmails" color="primary" />}
                  label="I want to receive inspiration, marketing promotions and updates via email."
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={!isRegisteredConsumer}
            >
              Submit
            </Button>
          </Box>
        </Box>
      </Container>
  </Layout>
}

export default SubmitBid