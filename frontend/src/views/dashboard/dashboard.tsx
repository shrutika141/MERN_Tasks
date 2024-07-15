import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';

import { Navbar } from './../Navbar/navbar.tsx';

export const Dashboard = () => {

  return (
    <Box>
      <Navbar />
      <Box flexGrow={1}>
        <Typography paragraph>
          Dashboard content goes here.
        </Typography>
      </Box>
    </Box>
  );
};
