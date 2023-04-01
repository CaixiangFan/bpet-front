import React, { useContext, useState, useEffect } from 'react';
import Layout from 'components/layout';
import { ethers } from "ethers";
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import {
  backendUrl,
  TOKEN_CONTRACT_ADDRESS
} from 'utils/utils';
import tokenAbi from 'utils/contracts/EnergyToken.sol/EnergyToken.json'
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
    Grid,
    Box
  } from '@mui/material';
import axios from 'axios';

// export async function getServerSideProps() {
//   const response = await axios.get(`${backendUrl}etk/balance/${account}`);
//   const ssrBalance = response.data;
//   return {
//     props: {ssrBalance}, // will be passed to the page component as props
//   }
// }

const BuyETK = ({ssrBalance}) => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const { state, dispatch } = useContext(Store);
  const { walletConencted, correctNetworkConnected, account, provider, signer } = state;
  const [usertype, setUsertype] = useState('');
  const [assetId, setAssetId] = useState('');
  const [etkBalance, setETKBalance] = useState(0);
  const [allowance, setAllowance] = useState(0);
  const [actionType, setActionType] = useState('buyETK');
  const [isRegisteredSupplier, setIsRegisteredSupplier] = useState(false);
  const [isRegisteredConsumer, setIsRegisteredConsumer] = useState(false);

  useEffect(() => {
    if (account.length === 0) return
    const checkRegistered = async () => {
      const resIsRegisteredSupplier = await axios.get(`${backendUrl}registry/isregisteredsupplier/${account}`);
      const resIsRegisteredConsumer = await axios.get(`${backendUrl}registry/isregisteredconsumer/${account}`);
      const _isRegisteredSupplier = resIsRegisteredSupplier.data;
      const _isRegisteredConsumer = resIsRegisteredConsumer.data;
      if (_isRegisteredSupplier) {
        const resRegisteredSupplier = await axios.get(`${backendUrl}registry/getsupplier/${account}`);
        const registeredSupplier = resRegisteredSupplier.data;
        setAssetId(registeredSupplier.assetId);
        setUsertype("Supplier");
      } else if (_isRegisteredConsumer) {
        const resRegisteredConsumer = await axios.get(`${backendUrl}registry/getconsumer/${account}`);
        const registeredConsumer = resRegisteredConsumer.data;
        setAssetId(registeredConsumer.assetId);
        setUsertype("Consumer");
      } else {
        const resRegisteredSupplier = await axios.get(`${backendUrl}registry/getsupplier/${account}`);
        const registeredSupplier = resRegisteredSupplier.data;
        enqueueSnackbar('This account has not been registered!', { variant: 'info', preventDuplicate: true });
      }
      setIsRegisteredSupplier(_isRegisteredSupplier);
      setIsRegisteredConsumer(_isRegisteredConsumer);
      const resEtkBalance = await axios.get(`${backendUrl}etk/balance/${account}`);
      const balance = resEtkBalance.data;
      setETKBalance(balance);

      const ownerAddressRes = await axios.get(`${backendUrl}etk/getOwnerAddress`);
      const allowanceRes = await axios.get(`${backendUrl}etk/allowance/${ownerAddressRes.data}/${account}`);
      const allowance = allowanceRes.data;
      setAllowance(allowance);
    }
    checkRegistered();
  }, [account])
  
  const handleActionTypeChange = (event) => {
    setActionType(event.target.value);
  }

  const inputValidate = (etkData) => {
    let allValid = true;
    if (etkData.actionType.length === 0) {
      allValid = false;
      enqueueSnackbar('You must select an action type', { variant: 'error' })
    }

    if (etkData.amount <= 0) {
      allValid = false;
      enqueueSnackbar('You must input a positive amount', { variant: 'error' })
    }
    return allValid;
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const etkData = {
      balance: data.get('balance'),
      usertype: usertype,
      assetID: data.get('assetID'),
      actionType: actionType,
      amount: Number(data.get('amount'))
    };
    const valid = inputValidate(etkData);
    if (!valid) return;

    if (!walletConencted || !signer) {
      enqueueSnackbar("You must login Metamask to continue", { variant: 'info', preventDuplicate: true});
      return
    }

    if (actionType === 'buyETK') {
      const buyToken = async (amount) => {
        await buyETK(amount);
        enqueueSnackbar("You bought tokens successfully!", { variant: 'success', preventDuplicate: true});
        const resEtkBalance = await axios.get(`${backendUrl}etk/balance/${account}`);
        const _etkBalance = resEtkBalance.data;
        setETKBalance(_etkBalance);
      }
      buyToken(etkData.amount);
    }

    if (actionType === 'redeemETK') {
      const redeemToken = async (amount) => {
        await redeemETK(amount);
        enqueueSnackbar("You burned tokens successfully!", { variant: 'success', preventDuplicate: true});
        const resEtkBalance = await axios.get(`${backendUrl}etk/balance/${account}`);
        const _etkBalance = resEtkBalance.data;
        setETKBalance(_etkBalance);
      }
      redeemToken(etkData.amount);
    }

  };

  const buyETK = async (amount) => {
    try {
      const ownerAddressRes = await axios.get(`${backendUrl}etk/getOwnerAddress`);
      const ownerAddress = ownerAddressRes.data;
      const tokenContractWrite = new ethers.Contract(TOKEN_CONTRACT_ADDRESS, tokenAbi.abi, signer);
      // Confirm receiving amount of fiat money from user before transfer the ETK
      await tokenContractWrite.transferFrom(ownerAddress, account, amount);
    } catch (err) {
      console.log(err);
    }
  }

  const redeemETK = async (amount) => {
    try{
      const ownerAddressRes = await axios.get(`${backendUrl}etk/getOwnerAddress`);
      const ownerAddress = ownerAddressRes.data;
      const tokenContractWrite = new ethers.Contract(TOKEN_CONTRACT_ADDRESS, tokenAbi.abi, signer);
      await tokenContractWrite.transfer(ownerAddress, amount);
      // Transfer amount of fiat money to user's account before burning the ETK
    } catch (err) {
      console.log(err);
    }
  }

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
            Buy/Redeem Energy Token (ETK)
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
                  disabled={true}
                />
              </Grid>

              <Grid item xs={12} sm={12}>
                <TextField
                  autoComplete="User Type"
                  name="userType"
                  fullWidth
                  id="userType"
                  disabled={true}
                  label={(isRegisteredSupplier || isRegisteredConsumer) ? usertype : "User Type"}
                />
              </Grid>

              <Grid item xs={12} sm={12}>
                <TextField
                  autoComplete="AssetID"
                  name="assetID"
                  fullWidth
                  id="assetID"
                  disabled={true}
                  label={(isRegisteredSupplier || isRegisteredConsumer) ? assetId : "AssetID"}
                />
              </Grid>

              <Grid item xs={12} sm={12}>
                <FormControl fullWidth required size='medium'>
                  <InputLabel id="action-type-select">Action Type</InputLabel>
                  <Select
                    labelId="action-type-select"
                    id="action-type-select"
                    value={actionType}
                    label= "Action Type"
                    onChange={handleActionTypeChange}
                  >          
                    <MenuItem value={'buyETK'}>buyETK</MenuItem>
                    <MenuItem value={'redeemETK'}>redeemETK</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <TextField                 
                  fullWidth
                  id="amount"
                  label={(actionType == 'buyETK' & allowance > 0) ? `0 ~ ${allowance}` : `0 ~ ${etkBalance}`}
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
              disabled={!isRegisteredSupplier && !isRegisteredConsumer}
            >
              Submit
            </Button>
          </Box>
        </Box>
      </Container>
  </Layout>
}

export default BuyETK