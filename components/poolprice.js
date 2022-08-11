import React from "react";
import { Typography, Box, Paper, Button, Card } from '@mui/material';

const PoolPrice = () => {

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
        <Typography alignContent='center' textAlign='center' margin='0.5rem'>Projected Pool Price for Hour Ending 18 is $834.37 as of 17:25</Typography>
      </Card>
    </Box>
  );
}

export default PoolPrice