import React, { useState, useEffect } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import Typography from '@mui/material/Typography';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { backendUrl } from 'utils/utils';
import axios from "axios";


const columns = [
  { id: 'dateHe', label: 'Date (HE)', minWidth: 150, align: 'center', format: (value) => value.toLocaleString('en-US')},
  { id: 'price', label: 'Price ($)', minWidth: 100,  align: 'center', format: (value) => value.toLocaleString('en-US')},
  {
    id: 'ail',
    label: 'AIL Demand (MW)',
    minWidth: 150,
    align: 'center',
    format: (value) => value.toLocaleString('en-US'),
  }
];

function createSMPData( dateHe, time, price, volume ) {
  return { dateHe, time, price, volume };
}

function createData( dateHe, price, ail ) {
  return { dateHe, price, ail };
}

const PPTable = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [rows, setRows] = useState([]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  useEffect(() => {
    const updateTable = async () => {
      const poolprices = await getPoolprice();
      setRows(poolprices);
    }
    updateTable();
  }, []);

  const getsmp = async () => {
    const smpMinutesRes =  await axios.get(`${backendUrl}poolmarket/getSystemMarginalMinutes`);
    const smpMinutes = smpMinutesRes.data;
    const smps = [];
    for (let i=smpMinutes.length-1; i>=0; i--) {
      var timestamp = smpMinutes[i];
      var marginalOfferRes = await axios.get(`${backendUrl}poolmarket/getMarginalOffer/${timestamp}`);
      var marginalOffer = marginalOfferRes.data;
      var price = marginalOffer.price;
      var volume = marginalOffer.amount;
      var dateObj = new Date(timestamp * 1000);
      var he = dateObj.toLocaleDateString("en-us");
      var minutes = dateObj.getMinutes();
      const hour = dateObj.getHours();
      smps.push(createSMPData(
                          `${he} ${hour+1}`, 
                          `${hour < 10 ? `0${hour}` : hour}:${minutes < 10 ? `0${minutes}` : minutes}`,
                          price,
                          volume));
    }
    return smps;
  }

  const getPoolprice = async () => {
    // loop to change to two dimentional array based on dateHE
    const uniqueDateheRows = [];
    const marginalPriceRows = await getsmp();
    if (marginalPriceRows.length > 0) {
      try {
        var currentDatehe = marginalPriceRows[0].dateHe;
        var currentDateheRows = [];
        for (let i=0; i<marginalPriceRows.length; i++) {
          if (marginalPriceRows[i].dateHe == currentDatehe) {
            currentDateheRows.push(marginalPriceRows[i]);
          } else {
            uniqueDateheRows.push(currentDateheRows);
            currentDateheRows = [];
            currentDateheRows.push(marginalPriceRows[i]);
            currentDatehe = marginalPriceRows[i].dateHe;
          }
          if (i == marginalPriceRows.length - 1) {
            uniqueDateheRows.push(currentDateheRows);
          }
        }
      } catch (err) {
        console.log(err);
      }
    }
    const poolprices = [];
    if (uniqueDateheRows.length > 0) {
      for (let i=0; i<uniqueDateheRows.length; i++) {
        var price = 0;
        var dateHe = uniqueDateheRows[i][0].dateHe;
        var time = uniqueDateheRows[i][0].time;
        var timestamp = Math.floor(new Date(`${dateHe.split(' ')[0]} ${time}`).getTime() / 1000);
        var totalDemandRes = await axios.get(`${backendUrl}poolmarket/getTotalDemand/${timestamp}`);
        var totalDemand = totalDemandRes.data;
  
        // Only one smp in the current hour
        if (uniqueDateheRows[i].length === 1) {
          price = Number(uniqueDateheRows[i][0].price);
          poolprices.push(createData(
            dateHe, 
            price,
            totalDemand));
          continue;
        }
  
        // More than one smps, take the weighted average
        var cumulativePrice = 0;
        var _smps = uniqueDateheRows[i].reverse();
        for (let j = 0; j < _smps.length; j++) {
          var smprice = Number(_smps[j].price);
          var duration = 0;
          if (j == 0) {
            duration = Number(_smps[j + 1].time.split(':')[1]);
          } else if (j == _smps.length - 1) {
            duration = 60 - Number(_smps[j].time.split(':')[1]);
          } else {
            duration =
              Number(_smps[j + 1].time.split(':')[1]) -
              Number(_smps[j].time.split(':')[1]);
          }
          cumulativePrice += smprice * duration;
        }
        
        price = Math.round((cumulativePrice / 60) * 100) / 100;
        poolprices.push(createData(
                      dateHe, 
                      price,
                      totalDemand));
      }    
    }
    return poolprices;
  }

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Typography variant='h6' alignContent='center' textAlign='center' margin='1rem'>Pool Price</Typography>
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
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.dateHe}>
                    {columns.map((column, index) => {
                      const value = row[column.id];
                      return (
                        <TableCell key={index} align={column.align}>
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
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
export default PPTable