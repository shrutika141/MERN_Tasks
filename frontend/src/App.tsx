import React, { useEffect, useState } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import "./App.scss";
import { Login } from './views/authentication/login.tsx';
import { Sidebar } from './views/sidebar/sidebar.tsx';
import { Routing } from './routes/index.tsx';

const App = () => {

  const theme = createTheme({
    palette: {
      primary: {
        main: '#859db6',
      },
      secondary: {
        main: '#dc004e',
      },
    },
  });

  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem('token'));
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <ThemeProvider theme={theme}>
      {token ? (
        <>
          <Sidebar  />
          <Routing />
        </>
      ) : (
        <Login setToken={setToken} />
      )}
    </ThemeProvider>
  );
};

export default App;