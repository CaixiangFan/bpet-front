// should be dynamic routes [tablename].js
import React from "react";
import { Typography, Box, Paper, Table, Card } from '@mui/material';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

function createData( dateHe, time, price, volume ) {
  return { dateHe, time, price, volume };
}

const rows = [
  createData('08/10/2022 22', '21:00', 118.01, 9),
  createData('08/10/2022 21',	'20:49',	118.01,	10),
  createData('08/10/2022 21',	'20:27',	721.08,	47),
  createData('08/10/2022 21',	'20:16',	738.44,	47),
  createData('08/10/2022 21',	'20:00',	749.16,	46),
  createData('08/10/2022 20',	'19:50',	751.27,	45),
  createData('08/10/2022 20',	'19:20',	774.04,	25),
  createData('08/10/2022 20',	'19:07',	786.89,	48),
  createData('08/10/2022 20',	'19:00',	800.99,	29),
  createData('08/10/2022 19',	'18:27',	800.41,	29),
  createData('08/10/2022 19',	'18:13',	780.09,	51),
  createData('08/10/2022 19',	'18:05',	810.59,	44),
  createData('08/10/2022 19',	'18:02',	838.18,	47),
  createData('08/10/2022 19',	'18:00',	856.97,	46),
];
// async function getInitialProps() {
//   const res = await axios.get('http://ets.aeso.ca/ets_web/ip/Market/Reports/CSMPriceReportServlet?contentType=html',{
//     headers: {
//       'X-Host': 'mall.film-ticket.film.list'
//     }
//   });
//   return {
//     films: res.data.data.films
//   }
// }

const SMPTable = () => {
  return ( 
    <TableContainer component={Paper}>
      <Typography variant='h6' alignContent='center' textAlign='center' margin='1rem'>System Marginal Price</Typography>
      <Table sx={{ minWidth: 410 }} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell>Date&nbsp;(HE)</TableCell>
            <TableCell align="center">Time</TableCell>
            <TableCell align="center">Price&nbsp;($)</TableCell>
            <TableCell align="center">Volume&nbsp;(MW)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.time}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.dateHe}
              </TableCell>
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