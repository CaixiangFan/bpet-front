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
import { convertBigNumberToNumber } from 'utils/tools';
import { poolmarketContractRead } from 'utils/const';

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
  // const [marginalPriceRows, setMarginalPriceRows] = useState();

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
    const smps = [];
    try {
      const totalDemandMinutes = await poolmarketContractRead.getTotalDemandMinutes();
      for (let i=totalDemandMinutes.length-1; i>=0; i--) {
        var timestamp = totalDemandMinutes[i];
        var marginalOffer = await poolmarketContractRead.getMarginalOffer(timestamp);
        var price = convertBigNumberToNumber(marginalOffer.price);
        var volume = convertBigNumberToNumber(marginalOffer.amount);
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
    } catch(error) {
      console.log(error);
    }
    return smps;
  }

  const getPoolprice = async () => {
    // loop to change to two dimentional array based on dateHE
    const uniqueDateheRows = [];
    const marginalPriceRows = await getsmp();
    try {
      // console.log(marginalPriceRows[0]);
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

    const poolprices = [];
    for (let i=0; i<uniqueDateheRows.length; i++) {
      var price = 0;
      if (uniqueDateheRows[i].length === 1) {
        price = Number(uniqueDateheRows[i][0].price);
      } else {
        var cumulativePrice = 0;
        var duration = 0;
        var length = uniqueDateheRows[i].length;
        for (let j=0; j<length; j++) {
          if (j === length - 1) {
            duration = 60 - Number(uniqueDateheRows[i][j].time.split(':')[1]);
          } else if (j === 0){
            duration = Number(uniqueDateheRows[i][j+1].time.split(':')[1]);
          } else {
            duration = Number(uniqueDateheRows[i][j+1].time.split(':')[1]) - Number(uniqueDateheRows[i][j].time.split(':')[1]);
          }
          cumulativePrice += Number(uniqueDateheRows[i][j].price) * duration;
        }
        price = Math.round(cumulativePrice / 60);
      }
      var dateHe = uniqueDateheRows[i][0].dateHe;
      var time = uniqueDateheRows[i][0].time;
      var timestamp = Math.floor(new Date(`${dateHe.split(' ')[0]} ${time}`).getTime() / 1000);
      var totalDemand = convertBigNumberToNumber(await poolmarketContractRead.totalDemands(timestamp));
      poolprices.push(createData(
                    dateHe, 
                    price,
                    totalDemand));
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