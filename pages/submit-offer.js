import React, { useContext, useState, useEffect } from 'react';
import Layout from 'components/layout';
import ElectricBoltIcon from '@mui/icons-material/ElectricBolt';
import { createTheme, ThemeProvider } from '@mui/material/styles';
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


const SubmitOffer = () => {

  const [usertype, setUsertype] = React.useState('');

  const handleChange = (event) => {
    setUsertype(event.target.value);
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get('email'),
      password: data.get('password'),
    });
  };

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
                <FormControl fullWidth required size='small'>
                  <InputLabel id="demo-simple-select-label">User Type</InputLabel>
                  <Select
                    labelId="user-type-select"
                    id="user-type-select"
                    value={usertype}
                    label="User Type"
                    onChange={handleChange}
                  >          
                    <MenuItem value={10}>Supplier</MenuItem>
                    <MenuItem value={20}>Consumer</MenuItem>
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
                  required
                  fullWidth
                  id="blockAmount"
                  label="Block Amount"
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
                  label="I want to receive inspiration, marketing promotions and updates via email."
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
          </Box>
        </Box>
      </Container>
  </Layout>
}

export default SubmitOffer