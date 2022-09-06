import React, { useState, useEffect } from "react";
import { Typography, Box, Card } from '@mui/material';
import { convertBigNumberToNumber } from 'utils/tools';
import {
  poolmarketContractRead,
  defaultProvider
} from 'utils/const';

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
    var _smps = await getsmp();
    
    var price = calculateProjectedPrice(_smps);
    console.log('smps: ', _smps);
    console.log('Current projected pool price', price);
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
          var marginalOffer = await poolmarketContractRead.getMarginalOffer(currentMinute);
          var volume = convertBigNumberToNumber(marginalOffer.amount);
          smps.push({"DateHE": `${he} ${hour+1}`, "Time": `${hour}:${minutes}`, "Price": convertBigNumberToNumber(smp), "Volume": volume});
        }
      }
    }
    return smps;
  }

  //ToDo: weighted average => calculate smp for every hour start
  const calculateProjectedPrice = (_smps) => {
    var projectedPrice = 0;
    if (_smps.length == 0) return projectedPrice;
    if (_smps.length == 1) {
      projectedPrice = Number(_smps[0].Price);
      return projectedPrice;
    }
    for (let i=0; i<_smps.length; i++) {
      var price = Number(_smps[i].Price);
      var duration = 0;
      if (i == 0) {
        duration = Number(_smps[i+1].Time.split(':')[1]);
      } else if (i == _smps.length - 1) {
        duration = 60 - Number(_smps[i].Time.split(':')[1]);
      } else {
        duration = Number(_smps[i+1].Time.split(':')[1]) - Number(_smps[i].Time.split(':')[1]);
      }
      projectedPrice += price * duration;
    }
    return Math.round((projectedPrice / 60) * 100) / 100;
  }

  const getOffers = async () => {
    const offerIds = await poolmarketContractRead.getValidOfferIDs();
    var offers = [];
    for (let i=0; i<offerIds.length; i++) {
      var offer = await poolmarketContractRead.getEnergyOffer(offerIds[i]);
      var amount = convertBigNumberToNumber(offer.amount);
      var price = convertBigNumberToNumber(offer.price);
      var submitMinute = convertBigNumberToNumber(offer.submitMinute);
      var supplierAccount = offer.supplierAccount;
      var isValid = offer.isValid;
      offers.push({amount, price, submitMinute, supplierAccount, isValid});
    }
    console.log('All valid offers: ', offers);
  }

  const getBids = async () => {
    const bidIds = await poolmarketContractRead.getValidBidIDs();
    var bids = [];
    for (let i=0; i<bidIds.length; i++) {
      var bid = await poolmarketContractRead.getEnergyBid(bidIds[i]);
      var submitTimeStamp = convertBigNumberToNumber(bid.submitMinute);
      var submitTime = new Date(submitTimeStamp * 1000);
      bids.push({"submitAt": submitTime.toLocaleTimeString('en-us', options), 
                "amount": convertBigNumberToNumber(bid.amount),
                "price": convertBigNumberToNumber(bid.price),
                "submitMinute": convertBigNumberToNumber(bid.submitMinute),
                "consumerAccount": bid.consumerAccount});
    }
    console.log('All valid bids: ', bids);
  }

  const getDispatchedOffers = async () => {
    const currBlock = await defaultProvider.getBlock("latest");
    const currHour = Math.floor(currBlock.timestamp / 3600) * 3600;
    const dispatchedOffers = await poolmarketContractRead.getDispatchedOffers(currHour);
    console.log('Dispatched offers: ', dispatchedOffers);
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