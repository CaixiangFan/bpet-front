import React, { useContext, useState, useEffect } from 'react';
import Layout from 'components/layout';
import { ethers } from "ethers";
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import { createTheme, ThemeProvider } from '@mui/material/styles';
// import Web3Modal from 'web3modal';
import {
  registryContractRead, 
  REGISTRY_CONTRACT_ADDRESS,
  tokenContractRead,
  TOKEN_CONTRACT_ADDRESS
} from 'utils/const';
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
    Link,
    Grid,
    Box
  } from '@mui/material';


const BuyETK = () => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const { state, dispatch } = useContext(Store);
  const { walletConencted, correctNetworkConnected, account, provider, signer } = state;
  const [usertype, setUsertype] = useState('');
  const [assetId, setAssetId] = useState('');
  const [etkBalance, setETKBalance] = useState(0);
  const [actionType, setActionType] = useState('buyETK');
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
      }
      buyToken(etkData.amount);
    }

    if (actionType === 'redeemETK') {
      const redeemToken = async (amount) => {
        await redeemETK(amount);
      }
      redeemToken(etkData.amount);
    }

  };

  // const getAdminSigner = async (adminAddress) => {
  //   const web3Modal = new Web3Modal({ network: 'mainnet', cacheProvider: true })
  //   const connection = await web3Modal.connect();
  //   const _provider = new ethers.providers.Web3Provider(connection);
  //   const _adminSigner = _provider.getSigner(adminAddress);
  //   return _adminSigner;
  // }

  const buyETK = async (amount) => {
    console.log('contract signer address', account);
    try {
      const _adminAddress = await tokenContractRead.owner();
      // const adminSigner = await getAdminSigner(_adminAddress);
      // console.log('admin signer address', await adminSigner.getAddress());
      const tokenContractWrite = new ethers.Contract(TOKEN_CONTRACT_ADDRESS, tokenAbi, signer);
      // Confirm receiving amount of fiat money from user before transfer the ETK
      await tokenContractWrite.transferFrom(_adminAddress, account, amount);
    } catch (err) {
      console.log(err);
    }
  }

  const redeemETK = async (amount) => {
    try{
      const _adminAddress = await tokenContractRead.owner();
      const tokenContractWrite = new ethers.Contract(TOKEN_CONTRACT_ADDRESS, tokenAbi, signer);
      // console.log('contract signer address', account);
      await tokenContractWrite.transfer(_adminAddress, amount);
      // const adminSigner = await getAdminSigner(_adminAddress);
      // console.log('admin signer address', await adminSigner.getAddress());
      // const adminTokenContractWrite = new ethers.Contract(TOKEN_CONTRACT_ADDRESS, tokenAbi, adminSigner);
      // Transfer amount of fiat money to user's account before burning the ETK
      // await adminTokenContractWrite.burnFrom(account, amount);
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