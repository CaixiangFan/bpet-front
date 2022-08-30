import React, { useContext, useEffect, useState } from 'react'
import { Typography, Box, Paper } from '@mui/material';
import { useRouter } from 'next/router'
import { useSnackbar } from 'notistack';
import Layout from 'components/layout'
import { Store } from "utils/Store";
import SMPTable from 'components/homepage/table-smp';
import PPTable from 'components/homepage/table-pp';

const Home = () => {
  const router = useRouter()
  const { state, dispatch } = useContext(Store);
  const { walletConencted, correctNetworkConnected, account, provider, signer } = state;
  const [loaded, setLoaded] = useState(false)


  useEffect(() => {
    const init = async () => {
      setLoaded(true)
    }
    init()
  }, [])

  return (
    <Layout title="Alberta">

      {
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
              height: 200,
              width: 600,
            },
          }}
        >
          <Paper elevation={1}>
            <Typography variant='h4' alignContent='center' textAlign='center' margin='1.5rem'>Welcome to BPET !</Typography>
            <Typography alignContent='center' textAlign='center'>Our blockchain-based peer-to-peer energy trading (BPET) system is a technology inavation for accelerating renewable energy flow in Alberta!</Typography>
          </Paper>
        </Box>
      }

      <Box
          sx={{
            marginTop: '1rem',
            display: 'flex',
            gridTemplateRows: 'repeat(2, 1fr)',
            alignItems: 'center',
            justifyContent: 'center',
            '& > :not(style)': {
              m: 1,
              maxWidth: '80vw',
              maxHeight: '80vh',
              height: 500,
              width: 500,
            },
          }}
        >
          <SMPTable />
          <PPTable />
        </Box>
    </Layout>
  )
}

export default Home