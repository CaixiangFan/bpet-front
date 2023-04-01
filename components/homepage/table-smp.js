import React, { useState, useEffect } from "react";
import { Typography, Paper, Table } from '@mui/material';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import { backendUrl } from 'utils/utils';
import axios from "axios";
const columns = [
  { id: 'dateHe', label: 'Date (HE)', minWidth: 150, align: 'center', format: (value) => value.toLocaleString('en-US')},
  {
    id: 'time',
    label: 'Time',
    minWidth: 60,
    align: 'center',
    format: (value) => value.toLocaleString('en-US'),
  },
  { id: 'price', label: 'Price ($)', minWidth: 100,  align: 'center', format: (value) => value.toLocaleString('en-US')},

  {
    id: 'volume',
    label: 'Volume (MW)',
    minWidth: 150,
    align: 'center',
    format: (value) => value.toLocaleString('en-US'),
  }
];

function createData( dateHe, time, price, volume ) {
  return { dateHe, time, price, volume };
}

const SMPTable = () => {
  const [marginalPriceRows, setMarginalPriceRows] = useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  useEffect(() => {
    const updateTable = async () => {
      const smps = await getsmp();
      setMarginalPriceRows(smps);
    }
    updateTable();
  }, []);

  //get all smps in the past
  const getsmp = async () => {
    const totalDemandMinutesRes =  await axios.get(`${backendUrl}poolmarket/getSystemMarginalMinutes`);
    const totalDemandMinutes = totalDemandMinutesRes.data;    
    const smps = [];
    for (let i=totalDemandMinutes.length-1; i>=0; i--) {
      var timestamp = totalDemandMinutes[i];
      var marginalOfferRes = await axios.get(`${backendUrl}poolmarket/getMarginalOffer/${timestamp}`);
      var marginalOffer = marginalOfferRes.data;
      var price = marginalOffer.price;
      var volume = marginalOffer.amount;
      var dateObj = new Date(timestamp * 1000);
      var he = dateObj.toLocaleDateString("en-us");
      var minutes = dateObj.getMinutes();
      const hour = dateObj.getHours();
      smps.push(createData(
                          `${he} ${hour+1}`, 
                          `${hour < 10 ? `0${hour}` : hour}:${minutes < 10 ? `0${minutes}` : minutes}`,
                          price,
                          volume));
    }
    return smps;
  }

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Typography variant='h6' alignContent='center' textAlign='center' margin='1rem'>System Marginal Price</Typography>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {marginalPriceRows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.dateHe + row.time + index}>
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.format && typeof value === 'number'
                            ? column.format(value)
                            : value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={marginalPriceRows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}

export default SMPTable