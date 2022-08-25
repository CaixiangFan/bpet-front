import React, { useContext, useState, useEffect } from 'react'
// import axios from 'axios';
import { ethers } from 'ethers';
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
import { Store } from "utils/Store";
// import List from '@mui/joy/List';
// import ListItem from '@mui/joy/ListItem';
// import { useRouter } from 'next/router'
import { useSnackbar } from 'notistack';
import Layout from 'components/layout'
import { DataGrid } from '@mui/x-data-grid';
import {
  registryContractRead, 
  REGISTRY_CONTRACT_ADDRESS,
  tokenContractRead,
  TOKEN_CONTRACT_ADDRESS
} from 'utils/const';
import tokenAbi from 'utils/contracts/EnergyToken.sol/EnergyToken.json';
import registryAbi from 'utils/contracts/Registry.sol/Registry.json';

const columns = [
  { field: 'id', headerName: 'ID', width: 90 },
  {
    field: 'firstName',
    headerName: 'First name',
    width: 150,
    editable: true,
  },
  {
    field: 'lastName',
    headerName: 'Last name',
    width: 150,
    editable: true,
  },
  {
    field: 'age',
    headerName: 'Age',
    type: 'number',
    width: 110,
    editable: true,
  },
  {
    field: 'fullName',
    headerName: 'Full name',
    description: 'This column has a value getter and is not sortable.',
    sortable: false,
    width: 160,
    valueGetter: (params) =>
      `${params.row.firstName || ''} ${params.row.lastName || ''}`,
  },
];

const rows = [
  { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
  { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
  { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
  { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
  { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
  { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
  { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
  { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
  { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
];

const Admin = () => {
  const [usertype, setUsertype] = useState('');
  const { state, dispatch } = useContext(Store);
  const [loaded, setLoaded] = useState(false);
  const [adminConnected, setAdminConnected] = useState(false);
  const [actionType, setActionType] = useState('mintETK');
  const [etkBalance, setETKBalance] = useState(0);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const { adminAddress, walletConencted, correctNetworkConnected, account, provider, signer } = state;

  const updateBalance = async () => {
    console.log(account);
    const tokenBalance = await tokenContractRead.balanceOf(account);
    setETKBalance(ethers.utils.formatEther(tokenBalance));
  }
  
  const handleUserTypeSelectChange = (event) => {
    setUsertype(event.target.value);
  };

  useEffect(() => {
    if (adminAddress.length === 0 || account.length == 0) {
      setLoaded(false);
      setAdminConnected(false);
    }
    if (adminAddress === account) {
      closeSnackbar();
      enqueueSnackbar('Welcome to the admin dashboard', { variant: 'success', preventDuplicate: true });
      setAdminConnected(true);
      updateBalance();
    } else {
      closeSnackbar();
      enqueueSnackbar('Sorry, you are not admin of the contract', { variant: 'error', preventDuplicate: true });
      setAdminConnected(false);
    }
  }, [account, adminAddress])

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
    // console.log({
    //   actionType: actionType,
    //   amount: data.get('amount'),
    // });
    const etkData = {
      balance: data.get('balance'),
      actionType: actionType,
      amount: Number(data.get('amount'))
    };
    const valid = inputValidate(etkData);
    if (!valid) return;

    if (!walletConencted || !signer) {
      enqueueSnackbar("You must login Metamask to continue", { variant: 'info', preventDuplicate: true});
      return
    }

    if (actionType === 'mintETK') {
      const mintToken = async (amount) => {
        await mintETK(amount);
      }
      mintToken(etkData.amount);
    }

    if (actionType === 'burnETK') {
      const burnToken = async (amount) => {
        await burnETK(amount);
      }
      burnToken(etkData.amount);
    }
    updateBalance();
  }

  const mintETK = async (amount) => {
    try {
      const tokenContractWrite = new ethers.Contract(TOKEN_CONTRACT_ADDRESS, tokenAbi, signer);
      await tokenContractWrite.mint(account, amount);
    } catch (err) {
      console.log(err);
    }
  }

  const burnETK = async (amount) => {
    try{
      const tokenContractWrite = new ethers.Contract(TOKEN_CONTRACT_ADDRESS, tokenAbi, signer);
      await tokenContractWrite.burn(amount);
    } catch (err) {
      console.log(err);
    }
  }

  const handleClickSearch = (event) => {
    event.preventDefault();
    const getUsers = async (userType) => {
      try{
        const registryContractWrite = new ethers.Contract(REGISTRY_CONTRACT_ADDRESS, registryAbi, signer);
        if (userType === 'suppliers') {
          const registeredSuppliers = await registryContractWrite.getAllSuppliers();
          console.log('supplier addresses: ', registeredSuppliers);
        } 
        if (userType === 'consumers') {
          const registeredConsumers = await registryContractWrite.getAllConsumers();
          console.log('Consumer addresses: ', registeredConsumers);
        }
      } catch(err) {
        console.log(err);
      }
    }
    getUsers(usertype);
    // console.log('usertype: ', usertype);
  }
  return (
    <Layout title="Admin">
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          </Box>
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
                  <FormControl fullWidth required size='medium'>
                    <InputLabel id="action-type-select">Action Type</InputLabel>
                    <Select
                      labelId="action-type-select"
                      id="action-type-select"
                      value={actionType}
                      label= "Action Type"
                      onChange={handleActionTypeChange}
                    >          
                      <MenuItem value={'mintETK'}>mintETK</MenuItem>
                      <MenuItem value={'burnETK'}>burnETK</MenuItem>
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

                {/* <Grid item xs={12}>
                  <FormControlLabel
                    control={<Checkbox value="allowExtraEmails" color="primary" />}
                    label="I have read and understand the terms and conditions of the agreement to buy ETK."
                  />
                </Grid> */}
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={adminAddress != account}
              >
                Submit
              </Button>
            </Box>
          <Box/>
        </Container>

      <Box sx = {{
        alignItems: 'center',
        marginTop: '2rem',
      }}
      >
        <Typography item component="h1" variant="h5" align='center'>
          Search Participants from Blockchain
        </Typography>
      </Box>
      
      <Box
        sx={{
          marginTop: 1,
          display: 'flex',
          // gridTemplateRows: 'repeat(2, 1fr)',
          alignItems: 'center',
          justifyContent: 'center',
          '& > :not(style)': {
            m: 1,
            maxWidth: '80vw',
            maxHeight: '80vh',
            height: 600,
            width: 700,
          },
        }}
      >

        <Grid container spacing={2}>

          <Grid item xs={12} sm={9}>
            <FormControl fullWidth size='small'>
              <InputLabel id="user-type-select">User Type</InputLabel>
              <Select
                labelId="user-type-select"
                id="user-type-select"
                value={usertype}
                label="User Type"
                onChange={handleUserTypeSelectChange}
              >          
                {/* <MenuItem value="">
                  <em>None</em>
                </MenuItem> */}
                <MenuItem value={'suppliers'}>All Registered Suppliers</MenuItem>
                <MenuItem value={'consumers'}>All Registered Consumers</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={3}>
              <Button
                type="Search"
                variant="contained"
                sx={{ mt: 0, mb: 2 }}
                onClick={ handleClickSearch }
              >
            Search
            </Button>
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ height: 500, width: '100%' }}>
              <DataGrid
                rows={rows}
                columns={columns}
                pageSize={10}
                rowsPerPageOptions={[10]}
                checkboxSelection
                disableSelectionOnClick
                experimentalFeatures={{ newEditingApi: true }}
              />
            </Box>
          </Grid>

        </Grid>
      </Box>
    </Layout>
  )
}

export default Admin