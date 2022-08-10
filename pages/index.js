import React, { useContext, useEffect, useState } from 'react'
import Layout from 'components/layout'
// import { ethers } from 'ethers';
// import { Typography, Box, Paper, Button } from '@mui/material';
// import { useRouter } from 'next/router'
// import { SnackbarProvider, enqueueSnackbar } from 'notistack'
// import { Store } from "utils/Store";
// import { defaultProvider, contractRead } from "utils/const"

const Home = () => {
  return (
    <Layout title="Alberta">
      <h1>
        Welcome to BPET System!
      </h1>
      <div>
        <p>
          Our blockchain-based peer-to-peer energy trading (BPET) system is a technology inavation for accelerating renewable energy flow in Alberta!
        </p>
      </div>
    </Layout>
  )
}

export default Home