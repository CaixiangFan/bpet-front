import React, { useContext, useState, useEffect } from 'react'
// import axios from 'axios';
import { Typography, Box, Paper, Button, TextField, InputLabel, MenuItem, FormControl, Select, CircularProgress } from '@mui/material';
// import { useRouter } from 'next/router'
// import { useSnackbar } from 'notistack';
import Layout from 'components/layout'

const SelectForm = () => {
  return (
    <Box
    sx={{
      marginTop: '1rem',
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      justifyContent: 'center',
      '& > :not(style)': {
        m: 1,
        maxWidth: '80vw',
        maxHeight: '80vh',
        height: 600,
        width: 600,
      },
    }}
  >
  <FormControl fullWidth>
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
      <MenuItem value={20}>All Registered Suppliers</MenuItem>
    </Select>
  </FormControl>
</Box>
  );
}

export default SelectForm