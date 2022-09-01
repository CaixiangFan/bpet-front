import React, { useState, useEffect } from "react";
import { Typography, Box, Paper, Button, Card } from '@mui/material';
import {
  poolmarketContractRead,
  POOLMARKET_CONTRACT_ADDRESS,
  defaultProvider
} from 'utils/const';

const PoolPrice = () => {
  const [smps, setSMPs] = useState([]);
  const [time, setTime] = useState();
  const [proprice, setProPrice] = useState();
  const [hourEnding, setHourEnding] = useState();

  const options = {
    year: "numeric", month: "numeric",  day: "numeric", hour: "2-digit", minute: "2-digit"  
  };

  const updatePrice = async () => {
    var datetime = new Date();
    setTime(datetime.toLocaleTimeString("en-us", options));
    setHourEnding(datetime.getHours() + 1);
    var price = calculateProjectedPrice();
    setProPrice(price); 
  }

  const getsmp = async () => {
    var datetime = new Date();
    const smps = [];
    const second = datetime.getSeconds();
    const minute = datetime.getMinutes();
    const hour = datetime.getHours();
    const currentTime = Math.floor(datetime.getTime() / 1000);
    const hourStart = currentTime - second - 60*minute;

    for (let i=1; i<=60; i++) {
      var currentMinute = hourStart + 60 * i;
      if (currentMinute < currentTime) {
        var smp = await poolmarketContractRead.getSMP(currentMinute);
        if (smp > 0) {
          var date = new Date(currentMinute * 1000);
          var he = date.toLocaleDateString("en-us");
          var minutes = date.getMinutes();
          smps.push({"DateHE": `${he} ${hour+1}`, "Time": `${hour}:${minutes}`, "Price": smp});
        }
      }
    }
    setSMPs(smps);
    console.log('SMPs: ', smps);
  }

  //ToDo: simple average => weighted average
  const calculateProjectedPrice = () => {
    var projectedPrice = 0;
    if (smps.length == 0) return projectedPrice;
    if (smps.length == 1) {
      projectedPrice = Number(smps[0].Price);
      return projectedPrice;
    }
    for (let i=0; i<smps.length; i++) {
      projectedPrice += Number(smps[i].Price);
    }
    return Math.round((projectedPrice / smps.length + Number.EPSILON) * 100) / 100;
  }

  const getOffers = async () => {
    const offerIds = await poolmarketContractRead.getValidOfferIDs();
    var offers = [];
    for (let i=0; i<offerIds.length; i++) {
      var offer = await poolmarketContractRead.getEnergyOffer(offerIds[i]);
      offers.push(offer);
    }
    console.log('All valid offers: ', offers);
  }

  const getDispatchedOffers = async () => {
    const currBlock = await defaultProvider.getBlock("latest");
    const currHour = Math.floor(currBlock.timestamp / 3600) * 3600;
    const dispatchedOffers = await poolmarketContractRead.getDispatchedOffers(currHour);
    console.log('Dispatched offers: ', dispatchedOffers);
  }

  useEffect(() => {
    getOffers();
    getDispatchedOffers();
    getsmp();
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