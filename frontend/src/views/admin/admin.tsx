import React, { useState } from 'react';
import { Box } from '@mui/material';
import { AdminSidebar } from '../sidebar/adminSidebar.tsx';
import { Users } from './../users/users.tsx';

export const AdminPanel = () => {
  const [currentScreen, setCurrentScreen] = useState('/admin-user');

  const renderScreen = () => {
    switch (currentScreen) {
      case '/admin-user':
        return <Users />;
      default:
        return <Users />;
    }
  };

  return (
    <Box display='flex'>
      <AdminSidebar onSelectScreen={setCurrentScreen} />
      <Box component='main' flexGrow={1} marginTop='5%' padding={3}>
        {renderScreen()}
      </Box>
    </Box>
  );
};
