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

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://www.aeso.ca/aeso/about-the-aeso/"  target="_blank">
        AESO
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const Register = () => {
  // const router = useRouter()
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const { state, dispatch } = useContext(Store);
  const { walletConencted, correctNetworkConnected, account, provider, signer, ticketCategories } = state;
  const [usertype, setUsertype] = React.useState('');

  const handleChange = (event) => {
    setUsertype(event.target.value);
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const registryData = {
      userType: usertype,
      assetID: ethers.utils.formatBytes32String(data.get('assetID')),
      capacityOrLoad: Number(data.get('capacityOrLoad')),
      blockAmount: Number(data.get('blockAmount')),
      orderControl: ethers.utils.formatBytes32String(data.get('orderControl'))
    };

    console.log('Registry Info: ', registryData);

    const register = async (usertype, registryData) => {
      // validate signature
      console.log('Current connected signer address: ', await signer.getAddress());

      await registerUser(usertype, registryData);

      if (usertype === 'Supplier') {
        const registeredSuppliers = await registryContractRead.getSupplier(walletConencted);
        console.log('Registered supplier: ', registeredSuppliers);
      } else {
        const registeredConsumers = await registryContractRead.getConsumer(walletConencted);
        console.log('Registered consumer: ', registeredConsumers);
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
                    label="User Type"
                    onChange={handleChange}
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
                  label="AssetID"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={12}>
                <TextField
                  required
                  fullWidth
                  id="capacityOrLoad"
                  label="Capacity or Load"
                  name="capacityOrLoad"
                  autoComplete="capacityOrLoad"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="blockAmount"
                  label="Block Amount (Optional)"
                  name="blockAmount"
                  autoComplete="blockAmount"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="orderControl"
                  label="Order Control (Optional)"
                  type="orderControl"
                  id="orderControl"
                  autoComplete="orderControl"
                />
              </Grid>
              <Grid item xs={12}>
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
            >
              Submit
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="#" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 5 }} />
      </Container>
  </Layout>
}

export default Register