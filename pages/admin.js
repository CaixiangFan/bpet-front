import React, { useContext, useState, useEffect } from 'react'
import { ethers } from 'ethers';
import {
  Avatar,
  Alert,
  Button,
  Select,
  Snackbar,
  MenuItem,
  FormControl,
  FormControlLabel,
  InputLabel,
  TextField,
  CssBaseline,
  Container,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  Typography,
  Checkbox,
  Link,
  Grid,
  Box
} from '@mui/material';
import { Store } from "utils/Store";
import { useSnackbar } from 'notistack';
import Layout from 'components/layout'
import { DataGrid } from '@mui/x-data-grid';
import {
  backendUrl,
  REGISTRY_CONTRACT_ADDRESS,
  TOKEN_CONTRACT_ADDRESS
} from 'utils/const';
import tokenAbi from 'utils/contracts/EnergyToken.sol/EnergyToken.json';
import registryAbi from 'utils/contracts/Registry.sol/Registry.json';
import axios from 'axios';

const supplierColumns = [
  { field: 'id', headerName: 'ID', width: 10 },
  {
    field: 'account',
    headerName: 'Account',
    width: 360,
    editable: false,
  },
  {
    field: 'assetId',
    headerName: 'Asset ID',
    width: 110,
    editable: false,
  },
  {
    field: 'allowance',
    headerName: 'Allowance',
    width: 80,
    editable: true,
  },
  {
    field: 'blockAmount',
    headerName: 'Blocks',
    type: 'number',
    width: 60,
    editable: false,
  },
  {
    field: 'capacity',
    headerName: 'Capacity',
    type: 'number',
    width: 70,
    editable: false,
  },
  {
    field: 'offerControl',
    headerName: 'Offer Control',
    sortable: false,
    width: 240
  },
];

const consumerColumns = [
  { field: 'id', headerName: 'ID', width: 50 },
  {
    field: 'account',
    headerName: 'Account',
    width: 360,
    editable: false,
  },
  {
    field: 'assetId',
    headerName: 'Asset ID',
    width: 120,
    editable: false,
  },
  {
    field: 'allowance',
    headerName: 'Allowance',
    width: 80,
    editable: true,
  },
  {
    field: 'load',
    headerName: 'Load',
    type: 'number',
    width: 60,
    editable: false,
  },
  {
    field: 'offerControl',
    headerName: 'Offer Control',
    sortable: false,
    width: 240
  },
];

const computeMutation = (newRow, oldRow) => {
  if (newRow.allowance !== oldRow.allowance) {
    return `Allowance from '${oldRow.allowance}' to '${newRow.allowance}'`;
  }
  return null;
}


const Admin = () => {
  const [usertype, setUsertype] = useState('suppliers');
  const { state, dispatch } = useContext(Store);
  const [loaded, setLoaded] = useState(false);
  const [adminConnected, setAdminConnected] = useState(false);
  const [actionType, setActionType] = useState('mintETK');
  const [etkBalance, setETKBalance] = useState(0);
  const [tabRows, setTabRows] = useState([]);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const { adminAddress, walletConencted, correctNetworkConnected, account, provider, signer } = state;
  const tokenContractWrite = new ethers.Contract(TOKEN_CONTRACT_ADDRESS, tokenAbi, signer);
  const registryContractWrite = new ethers.Contract(REGISTRY_CONTRACT_ADDRESS, registryAbi, signer);

  const useRowMutation = () => {
    return React.useCallback(
      (user) =>
        new Promise((resolve, reject) =>
          setTimeout(() => {
            if (user.allowance?.trim() === '') {
              reject(new Error("Error while saving data: allowance can't be empty."));
            } else {
              try {
                const updateAllowance = async () => {
                  await tokenContractWrite.approve(user.account, user.allowance);
                }
                updateAllowance();
              } catch (err) {
                console.log(err);
              }
              resolve(user);
            }
          }, 200),
        ),
      [],
    );
  };
  
  const mutateRow = useRowMutation();
  const noButtonRef = React.useRef(null);
  const [promiseArguments, setPromiseArguments] = React.useState(null);

  const [snackbar, setSnackbar] = React.useState(null);

  const handleCloseSnackbar = () => setSnackbar(null);

  const updateBalance = async () => {
    const response = await axios.get(`${backendUrl}etk/balance/${account}`);
    setETKBalance(response.data);
  }
  
  const handleUserTypeSelectChange = (event) => {
    setUsertype(event.target.value);
    setTabRows([]);
  };

  useEffect(() => {
    if (adminAddress.length === 0 || account.length == 0) {
      setLoaded(false);
      setAdminConnected(false);
    }
    else if (adminAddress === account) {
      closeSnackbar();
      enqueueSnackbar('Welcome to the admin dashboard', { variant: 'success', preventDuplicate: true });
      setAdminConnected(true);
      updateBalance();
    } else {
      closeSnackbar();
      setAdminConnected(false);
      enqueueSnackbar('Sorry, you are not admin', { variant: 'error', preventDuplicate: true });
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
        enqueueSnackbar("Admin minted tokens successfully!", { variant: 'success', preventDuplicate: true});
        await updateBalance();
      }
      mintToken(etkData.amount);
    }

    if (actionType === 'burnETK') {
      const burnToken = async (amount) => {
        await burnETK(amount);
        enqueueSnackbar("Admin burned tokens successfully!", { variant: 'success', preventDuplicate: true});
        await updateBalance();
      }
      burnToken(etkData.amount);
    }
  }

  const mintETK = async (amount) => {
    try {
      await tokenContractWrite.mint(account, amount);
    } catch (err) {
      console.log(err);
    }
  }

  const burnETK = async (amount) => {
    try{
      await tokenContractWrite.burn(amount);
    } catch (err) {
      console.log(err);
    }
  }

  const getUsers = async (userType) => {
    try{
      if (userType === 'suppliers') {
        const registeredSuppliers = await registryContractWrite.getAllSuppliers();
        // const registeredSuppliersRes = await axios.get(`${backendUrl}registry/getAllSuppliers`);
        // const registeredSuppliers = registeredSuppliersRes.data;
        let suppliers = [];
        for (let i=0; i<registeredSuppliers.length; i++) {
          // var supplierRes = await axios.get(`${backendUrl}registry/getsupplier/${registeredSuppliers[i]}`);
          // var supplier = supplierRes.data;
          if (!(/^0*$/.test(registeredSuppliers[i].split('x')[1]))) {
            const supplier = await registryContractWrite.getSupplier(registeredSuppliers[i]);
            const _allowance = await tokenContractWrite.allowance(adminAddress, registeredSuppliers[i]);
            suppliers.push({
              id: i+1, 
              account: supplier.account,
              assetId: supplier.assetId,
              allowance: _allowance,
              blockAmount: supplier.blockAmount,
              capacity: supplier.capacity,
              offerControl: supplier.offerControl
            });
          }
        }
        setTabRows(suppliers);
      } 
      if (userType === 'consumers') {
        const registeredConsumers = await registryContractWrite.getAllConsumers();
        let consumers = [];
        for (let i=0; i<registeredConsumers.length; i++) {
          if (!(/^0*$/.test(registeredConsumers[i].split('x')[1]))) {
            var consumer = await registryContractWrite.getConsumer(registeredConsumers[i]);
            var _allowance = await tokenContractWrite.allowance(adminAddress, registeredConsumers[i]);
            consumers.push({
              id: i+1, 
              account: consumer.account,
              assetId: consumer.assetId,
              allowance: _allowance,
              load: consumer.load,
              offerControl: consumer.offerControl
            });
          }
        }
        setTabRows(consumers);
      }
    } catch(err) {
      console.log(err);
    }
  }

  const handleClickSearch = (event) => {
    event.preventDefault();
    getUsers(usertype);
  }

  const processRowUpdate = React.useCallback(
    (newRow, oldRow) =>
      new Promise((resolve, reject) => {
        const mutation = computeMutation(newRow, oldRow);
        if (mutation) {
          // Save the arguments to resolve or reject the promise later
          setPromiseArguments({ resolve, reject, newRow, oldRow });
        } else {
          resolve(oldRow); // Nothing was changed
        }
      }),
    [],
  );

  const handleNo = () => {
    const { oldRow, resolve } = promiseArguments;
    resolve(oldRow); // Resolve with the old row to not update the internal state
    setPromiseArguments(null);
  };

  const handleYes = async () => {
    const { newRow, oldRow, reject, resolve } = promiseArguments;

    try {
      // Make the HTTP request to save in the backend
      const response = await mutateRow(newRow);
      setSnackbar({ children: 'User successfully updated', severity: 'success' });
      resolve(response);
      setPromiseArguments(null);
    } catch (error) {
      setSnackbar({ children: "Allowance can't be empty", severity: 'error' });
      reject(oldRow);
      setPromiseArguments(null);
    }
  };

  const handleProcessRowUpdateError = React.useCallback((error) => {
    setSnackbar({ children: error.message, severity: 'error' });
  }, []);

  const handleEntered = () => {
    // The `autoFocus` is not used because, if used, the same Enter that saves
    // the cell triggers "No". Instead, we manually focus the "No" button once
    // the dialog is fully open.
    // noButtonRef.current?.focus();
  };

  const renderConfirmDialog = () => {
    if (!promiseArguments) {
      return null;
    }

    const { newRow, oldRow } = promiseArguments;
    const mutation = computeMutation(newRow, oldRow);

    return (
      <Dialog
        maxWidth="xs"
        TransitionProps={{ onEntered: handleEntered }}
        open={!!promiseArguments}
      >
        <DialogTitle>Are you sure?</DialogTitle>
        <DialogContent dividers>
          {`Pressing 'Yes' will change ${mutation}.`}
        </DialogContent>
        <DialogActions>
          <Button ref={noButtonRef} onClick={handleNo}>
            No
          </Button>
          <Button onClick={handleYes}>Yes</Button>
        </DialogActions>
      </Dialog>
    );
  };

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
                <Grid item={true} xs={12} sm={12}>
                  <TextField
                    fullWidth
                    id="balance"
                    label={etkBalance}
                    name="etkBalance"
                    autoComplete="etkBalance"
                    disabled={true}
                  />
                </Grid>

                <Grid item={true} xs={12} sm={12}>
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

                <Grid item={true} xs={12}>
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
        <Typography component="h1" variant="h5" align='center'>
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
            width: 800,
          },
        }}
      >

        <Grid container spacing={2}>

          <Grid item={true} xs={12} sm={9}>
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

          <Grid item={true} xs={12} sm={3}>
              <Button
                type="Search"
                variant="contained"
                sx={{ mt: 0, mb: 2 }}
                onClick={ handleClickSearch }
                disabled={ adminAddress != account }
              >
            Search
            </Button>
          </Grid>

          <Grid item={true} xs={12}>
            <Box sx={{ height: 500, width: '100%' }}>
              {renderConfirmDialog()}
              <DataGrid
                rows={tabRows}
                columns={usertype === 'suppliers' ? supplierColumns : consumerColumns}
                processRowUpdate={processRowUpdate}
                onProcessRowUpdateError={handleProcessRowUpdateError}
                pageSize={10}
                rowsPerPageOptions={[10]}
                checkboxSelection
                disableSelectionOnClick
                experimentalFeatures={{ newEditingApi: true }}
              />
              {!!snackbar && (
                <Snackbar open onClose={handleCloseSnackbar} autoHideDuration={6000}>
                  <Alert {...snackbar} onClose={handleCloseSnackbar} />
                </Snackbar>
              )}
            </Box>
          </Grid>

        </Grid>
      </Box>
    </Layout>
  )
}

export default Admin