import React, { useContext, useEffect, useState } from 'react'
import { ethers } from 'ethers';
import { Typography, Box, Paper, Button, Card } from '@mui/material';
import { useRouter } from 'next/router'
import { useSnackbar } from 'notistack';
import Layout from 'components/layout'
import { Store } from "utils/Store";
import { defaultProvider, contractRead } from "utils/const";
import SMPTable from 'components/homepage/table-smp';
import PPTable from 'components/homepage/table-pp';

const Home = () => {
  const router = useRouter()
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const { state, dispatch } = useContext(Store);
  const { walletConencted, correctNetworkConnected, account, provider, signer } = state;
  const [eventDate, setEventDate] = useState('')
  const [eventName, setEventName] = useState('')
  const [eventTime, setEventTime] = useState('')
  const [loaded, setLoaded] = useState(false)


  useEffect(() => {

    const init = async () => {
      const eventDetails = await contractRead.eventDetails()
      const _eventDate = ethers.utils.parseBytes32String(eventDetails.eventDate)
      const _eventName = ethers.utils.parseBytes32String(eventDetails.eventName)
      const _eventTime = ethers.utils.parseBytes32String(eventDetails.eventTime)
      // console.log(eventDate,eventName, eventTime)
      setEventDate(_eventDate)
      setEventName(_eventName)
      setEventTime(_eventTime)
      setLoaded(true)
    }
    init()
  }, [])


  const onClickHandler = (event) => {
    router.push('/buy-ticket')
  }

  return (
    <Layout title="Alberta">

      {loaded &&
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
            {/* <Typography variant='h4' alignContent='center' textAlign='center'>{eventName}</Typography>
            <Typography variant='h6' sx={{ textAlign: 'center', fontSize: '1.2rem', margin: '0.25rem' }}>{eventDate}</Typography>
            <Typography variant='h6' sx={{ textAlign: 'center', fontSize: '1.2rem;', margin: '0.25rem' }}>{eventTime}</Typography> */}
            <Typography alignContent='center' textAlign='center'>Our blockchain-based peer-to-peer energy trading (BPET) system is a technology inavation for accelerating renewable energy flow in Alberta!</Typography>

            {/* <Box textAlign='center' margin='3rem'>
              <Button variant="outlined" size="large" onClick={onClickHandler}>
                Buy a Ticket!
              </Button>
            </Box> */}
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