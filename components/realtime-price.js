import React, { useState, useEffect } from "react";
import { Typography, Box, Card } from '@mui/material';
import {  backendUrl } from 'utils/utils';
import axios from "axios";

const options = {
  year: "numeric", month: "numeric",  day: "numeric", hour: "2-digit", minute: "2-digit"  
};

const PoolPrice = () => {
  const [time, setTime] = useState();
  const [proprice, setProPrice] = useState();
  const [hourEnding, setHourEnding] = useState();

  const updatePrice = async () => {
    var datetime = new Date();
    setTime(datetime.toLocaleTimeString("en-us", options));
    setHourEnding(datetime.getHours() + 1);
    try{
      var _smpsResponse = await axios.get(`/api/poolmarket/getsmp`);
      var priceResponse = await axios.get(`/api/poolmarket/getProjectedPoolPrice`);
      console.log('smps: ', _smpsResponse.data);
      console.log('Current projected pool price', priceResponse.data);
      setProPrice(priceResponse.data);
    } catch (error) {
      console.log(error)
    }

  }

  const getOffers = async () => {
    const offersResponse = await axios.get(`/api/poolmarket/getOffers`);
    console.log('All valid offers: ', offersResponse.data);
  }

  const getBids = async () => {
    const bidsResponse = await axios.get(`/api/poolmarket/getBids`);
    console.log('All current bids: ', bidsResponse.data);
  }

  const getDispatchedOffers = async () => {
    const dispatchedOffersResponse = await axios.get(`/api/poolmarket/getDispatchedOffers`)
    console.log('Dispatched offers: ', dispatchedOffersResponse.data);
  }

  useEffect(() => {
    getOffers();
    getBids();
    getDispatchedOffers();
    updatePrice();
    const interval = setInterval(() => updatePrice(), 50000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <Box
      sx={{
      marginTop: '0.5rem',
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      justifyContent: 'center',
      '& > :not(style)': {
        m: 0,
        maxWidth: '80vw',
        maxHeight: '80vh',
        height: 40,
        width: 600,
      },
    }}>
      <Card elevation={0}>
        <Typography alignContent='center' textAlign='center' margin='0.5rem'>Projected Pool Price for Hour Ending {hourEnding} is ${proprice} as of {time} </Typography>
      </Card>
    </Box>
  );
}

export default PoolPrice