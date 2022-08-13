import React, { useState, useEffect } from "react";
import { Typography, Box, Paper, Button, Card } from '@mui/material';
import axios from 'axios';

// async function getData() {
//   const res = await axios.get('http://ets.aeso.ca/ets_web/ip/Market/Reports/CSMPriceReportServlet?contentType=html',{
//     headers: {
//       'Access-Control-Allow-Origin': true,
//       'content-type': 'application/json',
//     }
//   });
//   const rtprice = res.data.match(/Projected Pool Price(.*?)\.\</g)[0];
//   console.log(rtprice);
//   return {
//     props: { rtprice }
//   }
// }

const PoolPrice = () => {
  // const { rtprice } = getData(); 

  const [time, setTime] = useState(false);

  const options = {  
    year: "numeric", month: "short",  day: "numeric", hour: "2-digit", minute: "2-digit"  
  };

  useEffect(() => {
    setTime(new Date().toLocaleTimeString("en-us", options));
    const interval = setInterval(() => setTime(new Date().toLocaleTimeString("en-us", options)), 50000);
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
        <Typography alignContent='center' textAlign='center' margin='0.5rem'>Projected Pool Price for Hour Ending 18 is $834.37 as of {time} </Typography>
      </Card>
    </Box>
  );
}

export default PoolPrice