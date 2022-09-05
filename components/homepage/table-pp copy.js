// should be dynamic routes [tablename].js
import React from "react";
import { Typography, Box, Paper, Table, Card } from '@mui/material';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import axios from 'axios';

function createData( dateHe, price, ravg, ail ) {
  return { dateHe, price, ravg, ail };
}

const rows = [
  createData('08/10/2022 21',	621.19,	162.13,	10273.0),
  createData('08/10/2022 20',	776.17,	162.13,	10384.0),
  createData('08/10/2022 19',	800.80,	161.53,	10522.0),
  createData('08/10/2022 18',	834.37,	161.36,	10648.0),
  createData('08/10/2022 17',	805.46,	161.33,	10651.0),
  createData('08/10/2022 16',	801.27,	161.37,	10596.0),
  createData('08/10/2022 15',	802.64,	161.07,	10448.0),
  createData('08/10/2022 14',	820.96,	160.28,	10406.0),
  createData('08/10/2022 13',	820.03,	159.39,	10302.0),
  createData('08/10/2022 12',	576.32,	158.66,	10246.0),
  createData('08/10/2022 11',	125.67,	158.00,	10163.0),
  createData('08/10/2022 10',	421.80,	157.95,	9962.0),
  createData('08/10/2022 09',	78.89, 157.48, 9836.0),
  createData('08/10/2022 08',	60.28, 157.46, 9561.0),
  createData('08/10/2022 07',	58.72, 157.45, 9273.0),
  createData('08/10/2022 06',	52.63, 157.43, 9125.0),
  createData('08/10/2022 05',	53.51, 157.42, 9034.0),
  createData('08/10/2022 04',	54.24, 157.40, 9058.0),
  createData('08/10/2022 03',	52.03, 157.38, 9126.0),
  createData('08/10/2022 02',	51.88, 157.37, 9254.0),
  createData('08/10/2022 01',	48.99, 157.36, 9413.0),
];

async function getData() {
  const res = await axios.get('http://ets.aeso.ca/ets_web/ip/Market/Reports/SMPriceReportServlet?contentType=html',{
    headers: {
      'Access-Control-Allow-Origin': true,
      'content-type': 'application/json',
    }
  });

  const tabledata = res.data.split('<TABLE BORDER="1" ALIGN="CENTER">')[1];
  // console.log('Parsed table: ', tabledata); // => <a href="#">Link...
  // const head = tabledata.match(/\<TH\>(.*?)\<\/TH\>/g)
  // console.log(head);
  return {
    props: { res }
  }
}

const PPTable = () => {
  // const restable = getData();

  return ( 
    <TableContainer component={Paper}>
      <Typography variant='h6' alignContent='center' textAlign='center' margin='1rem'>Pool Price</Typography>
      <Table stickyHeader aria-label="sticky table" sx={{ minWidth: 410 }} size="small">
        <TableHead>
          <TableRow>
            <TableCell>Date&nbsp;(HE)</TableCell>
            <TableCell align="center">Price&nbsp;($)</TableCell>
            <TableCell align="center">30Ravg&nbsp;($)</TableCell>
            <TableCell align="center">AIL Demand&nbsp;(MW)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.dateHe}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.dateHe}
              </TableCell>
              <TableCell align="center">{row.price}</TableCell>
              <TableCell align="center">{row.ravg}</TableCell>
              <TableCell align="center">{row.ail}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default PPTable