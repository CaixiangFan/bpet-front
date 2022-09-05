import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import Typography from '@mui/material/Typography';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';

const columns = [
  { id: 'dateHe', label: 'Date (HE)', minWidth: 150, align: 'center', format: (value) => value.toLocaleString('en-US')},
  { id: 'price', label: 'Price ($)', minWidth: 100,  align: 'center', format: (value) => value.toLocaleString('en-US')},
  {
    id: 'ravg',
    label: '30Ravg($)',
    minWidth: 60,
    align: 'center',
    format: (value) => value.toLocaleString('en-US'),
  },
  {
    id: 'ail',
    label: 'AIL Demand (MW)',
    minWidth: 150,
    align: 'center',
    format: (value) => value.toLocaleString('en-US'),
  }
];

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

export default function StickyHeadTable() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

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
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
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
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}