import React, { useContext, useState, useEffect } from 'react'
// import axios from 'axios';
import { Typography, Box, Grid, Button, ListItem, List, TextField, InputLabel, MenuItem, FormControl, Select, Paper } from '@mui/material';
// import List from '@mui/joy/List';
// import ListItem from '@mui/joy/ListItem';
// import { useRouter } from 'next/router'
// import { useSnackbar } from 'notistack';
import Layout from 'components/layout'
import { DataGrid } from '@mui/x-data-grid';

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
  const [usertype, setUsertype] = React.useState('');

  const handleChange = (event) => {
    setUsertype(event.target.value);
  };
  // useEffect(() => {
  //   if (adminAddress.length === 0 || account.length == 0) {
  //     setLoaded(false)
  //     setAdminConnected(false)
  //   }
  //   if (adminAddress === account) {
  //     closeSnackbar()
  //     enqueueSnackbar('Welcome to the admin dashboard', { variant: 'success' })
  //     setAdminConnected(true)
  //   } else {
  //     closeSnackbar()
  //     enqueueSnackbar('Sorry, you are not admin of the contract', { variant: 'error' })
  //     setAdminConnected(false)
  //   }
  // }, [account, adminAddress])

  return (
    <Layout title="Admin">
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
          marginTop: '3rem',
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
              <InputLabel id="demo-simple-select-label">User Type</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={usertype}
                label="User Type"
                onChange={handleChange}
              >          
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value={10}>All Registered Suppliers</MenuItem>
                <MenuItem value={20}>All Registered Consumers</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={3}>
              <Button
                type="Search"
                variant="contained"
                sx={{ mt: 0, mb: 2 }}
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