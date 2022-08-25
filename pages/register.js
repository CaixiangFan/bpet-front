import React, { useContext, useState, useEffect } from 'react';
import { ethers } from "ethers";
import Layout from 'components/layout';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import {registryContractRead, REGISTRY_CONTRACT_ADDRESS} from 'utils/const';
import registryAbi from 'utils/contracts/Registry.sol/Registry.json';
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
  import { useSnackbar, closeSnackbar } from 'notistack';


const Register = () => {
  // const router = useRouter()
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const { state, dispatch } = useContext(Store);
  const { walletConencted, correctNetworkConnected, account, provider, signer, ticketCategories } = state;
  const [usertype, setUsertype] = useState('');
  const [assetId, setAssetId] = useState('');
  const [capacityOrLoad, setCapacityOrLoad] = useState(0);
  const [blockAmount, setBlockAmount] = useState(0);
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
        setCapacityOrLoad(registeredSupplier.capacity);
        setUsertype("Supplier");
        setBlockAmount(registeredSupplier.blockAmount);
        setOfferControl(registeredSupplier.offerControl);
      } else if (_isRegisteredConsumer) {
        const registeredConsumer = await registryContractRead.getConsumer(account);
        setAssetId(registeredConsumer.assetId);
        setCapacityOrLoad(registeredConsumer.load);
        setUsertype("Consumer");
        setOfferControl(registeredConsumer.offerControl);
      }
      setIsRegisteredSupplier(_isRegisteredSupplier);
      setIsRegisteredConsumer(_isRegisteredConsumer);
    }
    checkRegistered()
  }, [account])

  const handleUsertypeChange = (event) => {
    setUsertype(event.target.value);
  }

  const inputValidate = (registryData) => {
    let allValid = true;
    if (registryData.userType.length === 0) {
      allValid = false;
      enqueueSnackbar('You must select suer type', { variant: 'error' })
    }

    if (registryData.assetID.length === 0) {
      allValid = false;
      enqueueSnackbar('You must input AssetID', { variant: 'error' })
    }
    if (registryData.capacityOrLoad <= 0) {
      allValid = false;
      enqueueSnackbar('You must input a positive capacity or load', { variant: 'error' })
    }
    return allValid;
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const registryData = {
      userType: usertype,
      assetID: data.get('assetID'),
      capacityOrLoad: Number(data.get('capacityOrLoad')),
      blockAmount: Number(data.get('blockAmount')),
      orderControl: data.get('orderControl')
    };
    const valid = inputValidate(registryData);
    if (!valid) return;

    if (!walletConencted || !signer) {
      enqueueSnackbar("You must login Metamask to continue", { variant: 'info', preventDuplicate: true});
      return
    }
    // console.log('Registry Input Data: ', registryData);
    const register = async (usertype, registryData) => {
      // validate signature
      enqueueSnackbar(`You are registering ${registryData.assetID}, waiting for confirmation...`, { variant: 'success' });
      await registerUser(usertype, registryData);
      enqueueSnackbar("User registered successfully!", { variant: 'success', preventDuplicate: true});
      if (usertype === 'Supplier') {
        const registeredSupplier = await registryContractRead.getSupplier(signer.getAddress());
        // console.log('Registered supplier: ', registeredSupplier);
      } else {
        const registeredConsumer = await registryContractRead.getConsumer(signer.getAddress());
        // console.log('Registered consumer: ', registeredConsumer);
      }
    }
    register(usertype, registryData);
  };

  const registerUser = async (userType, registryData) => {
    const registryContractWrite = new ethers.Contract(REGISTRY_CONTRACT_ADDRESS, registryAbi, signer);
    if (userType === 'Supplier') {
      const registerSupplierTx = await registryContractWrite.registerSupplier(
        registryData.assetID,
        registryData.blockAmount,
        registryData.capacityOrLoad,
        registryData.orderControl
        );
      await registerSupplierTx.wait();
    }
    else if (userType === 'Consumer') {
      const registerConsumerTx = await registryContractWrite.registerConsumer(
        registryData.assetID,
        registryData.capacityOrLoad,
        registryData.orderControl
        );
      await registerConsumerTx.wait();
    }
  }

  return <Layout title='Register'>
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
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Register to Pool Market
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>

              <Grid item xs={12} sm={12}>
                <FormControl fullWidth required size='medium'>
                  <InputLabel id="user-type-select">User Type</InputLabel>
                  <Select
                    labelId="user-type-select"
                    id="user-type-select"
                    value={usertype}
                    label={(isRegisteredSupplier || isRegisteredConsumer) ? usertype : "User Type"}
                    onChange={handleUsertypeChange}
                    disabled={isRegisteredSupplier || isRegisteredConsumer}
                  >          
                    <MenuItem value={'Supplier'}>Supplier</MenuItem>
                    <MenuItem value={'Consumer'}>Consumer</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={12}>
                <TextField
                  autoComplete="AssetID"
                  name="assetID"
                  required
                  fullWidth
                  id="assetID"
                  label={(isRegisteredSupplier || isRegisteredConsumer) ? assetId : "AssetID"}
                  autoFocus
                  disabled={isRegisteredSupplier || isRegisteredConsumer}
                />
              </Grid>
              <Grid item xs={12} sm={12}>
                <TextField
                  required
                  fullWidth
                  id="capacityOrLoad"
                  label={(isRegisteredSupplier || isRegisteredConsumer) ? capacityOrLoad : "Capacity or Load"}
                  name="capacityOrLoad"
                  autoComplete="capacityOrLoad"
                  disabled={isRegisteredSupplier || isRegisteredConsumer}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="blockAmount"
                  label={(isRegisteredSupplier || isRegisteredConsumer) ? blockAmount : "Block Amount (Optional)"}
                  name="blockAmount"
                  autoComplete="blockAmount"
                  disabled={isRegisteredSupplier || isRegisteredConsumer}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="orderControl"
                  label={(isRegisteredSupplier || isRegisteredConsumer) ? offerControl : "Order Control (Optional)"}
                  type="orderControl"
                  id="orderControl"
                  autoComplete="orderControl"
                  disabled={isRegisteredSupplier || isRegisteredConsumer}
                />
              </Grid>
              <Grid item xs={12} hidden={isRegisteredSupplier || isRegisteredConsumer}>
                <FormControlLabel
                  control={<Checkbox value="allowExtraEmails" color="primary" />}
                  label="I have read and understand the terms and conditions of the agreement to register a user."
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={isRegisteredSupplier || isRegisteredConsumer}
            >
              {isRegisteredSupplier || isRegisteredConsumer ? 'Already Registered' : 'Submit'}
            </Button>
          </Box>
        </Box>
      </Container>
  </Layout>
}

export default Register