// should be dynamic routes [tablename].js
import React, { useState, useEffect } from "react";
import { Typography, Box, Paper, Table, Card } from '@mui/material';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { convertBigNumberToNumber } from 'utils/tools';
import {
  poolmarketContractRead,
  tokenContractRead,
  defaultProvider
} from 'utils/const';

function createData( id, dateHe, time, price, volume ) {
  return { id, dateHe, time, price, volume };
}

const SMPTable = () => {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const updateTable = async () => {
      const smps = await getsmp();
      setRows(smps);
    }
    updateTable();
  }, []);

  //get all smps in the past
  const getsmp = async () => {
    // var datetime = new Date();
    // const currentTime = Math.floor(datetime.getTime() / 1000);
    // const startTime = currentTime - 3 * 3600;
    console.log('current time: ', new Date().toLocaleTimeString('en-us'));
    const totalDemandMinutes = await poolmarketContractRead.getTotalDemandMinutes();
    const smps = [];
    var index = 0;
    for (let i=0; i<totalDemandMinutes.length; i++) {
      var timestamp = totalDemandMinutes[i];
      // if (timestamp < currentTime) {
      var marginalOffer = await poolmarketContractRead.getMarginalOffer(timestamp);
      var price = convertBigNumberToNumber(marginalOffer.price);
      var volume = convertBigNumberToNumber(marginalOffer.amount);

      var dateObj = new Date(timestamp * 1000);
      var he = dateObj.toLocaleDateString("en-us");
      var minutes = dateObj.getMinutes();
      const hour = dateObj.getHours();
      index += 1;
      smps.push(createData(index,
                          `${he} ${hour+1}`, 
                          `${hour < 10 ? `0${hour}` : hour}:${minutes < 10 ? `0${minutes}` : minutes}`,
                          price,
                          volume));
      // }
    }
    console.log('SMP table content: ', smps);
    return smps;
  }

  return ( 
    <TableContainer component={Paper}>
      <Typography variant='h6' alignContent='center' textAlign='center' margin='1rem'>System Marginal Price</Typography>
      <Table stickyHeader aria-label="sticky table" sx={{ minWidth: 410 }} size="small">
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Date&nbsp;(HE)</TableCell>
            <TableCell align="center">Time</TableCell>
            <TableCell align="center">Price&nbsp;($)</TableCell>
            <TableCell align="center">Volume&nbsp;(MW)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell align="center">{row.id}</TableCell>
              <TableCell component="th" scope="row">{row.dateHe}</TableCell>
              <TableCell align="center">{row.time}</TableCell>
              <TableCell align="center">{row.price}</TableCell>
              <TableCell align="center">{row.volume}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default SMPTable