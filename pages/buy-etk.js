import React, { useContext, useState, useEffect } from 'react';
import Layout from 'components/layout';
import { ethers } from "ethers";
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {
  registryContractRead, 
  REGISTRY_CONTRACT_ADDRESS,
  tokenContractRead,
  TOKEN_CONTRACT_ADDRESS
} from 'utils/const';
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


const BuyETK = () => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const { state, dispatch } = useContext(Store);
  const { walletConencted, correctNetworkConnected, account, provider, signer, ticketCategories } = state;
  const [usertype, setUsertype] = useState('');
  const [assetId, setAssetId] = useState('');
  const [etkBalance, setETKBalance] = useState(0);
  const [amountType, setAmountType] = useState('buyETKAmount');
  const [offerControl, setOfferControl] = useState('');
  const [isRegisteredSupplier, setIsRegisteredSupplier] = useState(false);
  const [isRegisteredConsumer, setIsRegisteredConsumer] = useState(false);

  useEffect(() => {
    if (account.length === 0) return
    const checkRegistered = async () => {
      const _isRegisteredSupplier = await registryContractRead.isRegisteredSupplier(account);
      const _isRegisteredConsumer = await registryContractRead.isRegisteredSupplier(account);
      if (_isRegisteredSupplier) {
        const registeredSupplier = await registryContractRead.getSupplier(account);
        setAssetId(registeredSupplier.assetId);
        setUsertype("Supplier");
      } else if (_isRegisteredConsumer) {
        const registeredConsumer = await registryContractRead.getConsumer(account);
        setAssetId(registeredConsumer.assetId);
        setUsertype("Consumer");
      } else {
        enqueueSnackbar('This account has not been registered!', { variant: 'info', preventDuplicate: true });
      }
      setIsRegisteredSupplier(_isRegisteredSupplier);
      setIsRegisteredConsumer(_isRegisteredConsumer);
      const _etkBalance = await tokenContractRead.balanceOf(account);
      setETKBalance(ethers.utils.formatEther(_etkBalance));
    }
    checkRegistered();
  }, [account])
  
  const handleAmountTypeChange = (event) => {
    setAmountType(event.target.value);
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      amountType: amountType,
      amount: data.get('amount'),
    });
  };

  return <Layout title='BuyETK'>
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
            <MonetizationOnIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Buy Energy Token (ETK)
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={12}>
                <TextField
                  fullWidth
                  id="balance"
                  label={etkBalance}
                  name="etkBalance"
                  autoComplete="etkBalance"
                  disabled
                />
              </Grid>

              <Grid item xs={12} sm={12}>
                <TextField
                  autoComplete="User Type"
                  name="userType"
                  fullWidth
                  id="userType"
                  disabled
                  label={(isRegisteredSupplier || isRegisteredConsumer) ? usertype : "User Type"}
                />
              </Grid>

              <Grid item xs={12} sm={12}>
                <TextField
                  autoComplete="AssetID"
                  name="assetID"
                  fullWidth
                  id="assetID"
                  disabled
                  label={(isRegisteredSupplier || isRegisteredConsumer) ? assetId : "AssetID"}
                />
              </Grid>

              <Grid item xs={12} sm={12}>
                <FormControl fullWidth required size='medium'>
                  <InputLabel id="amount-type-select">Amount Type</InputLabel>
                  <Select
                    labelId="amount-type-select"
                    id="amount-type-select"
                    value={amountType}
                    label= "Amount Type"
                    onChange={handleAmountTypeChange}
                  >          
                    <MenuItem value={'buyETKAmount'}>buyETKAmount</MenuItem>
                    <MenuItem value={'payETHAmount'}>payETHAmount</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <TextField                 
                  fullWidth
                  id="amount"
                  label="Amount"
                  name="amount"
                  autoComplete="amount"
                  autoFocus
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <FormControlLabel
                  control={<Checkbox value="allowExtraEmails" color="primary" />}
                  label="I have read and understand the terms and conditions of the agreement to buy ETK."
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={!isRegisteredSupplier & !isRegisteredConsumer}
            >
              Submit
            </Button>
          </Box>
        </Box>
      </Container>
  </Layout>
}

export default BuyETK