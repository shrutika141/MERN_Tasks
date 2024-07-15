import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import "./App.scss";
import { Login } from './views/authentication/login.tsx';
import { Register } from './views/authentication/register.tsx';
import { ProtectedRoute } from './routes/protectedRoutes.tsx';
import { Dashboard } from './views/dashboard/dashboard.tsx';
import { AdminPanel } from './views/admin/admin.tsx';
import { EditUser } from './views/users/editUsers.tsx';
import { AddUser } from './views/users/addUser.tsx';

const App = () => {

  const theme = createTheme({
    palette: {
      primary: {
        main: '#1976d2',
      },
      secondary: {
        main: '#dc004e',
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<ProtectedRoute allowedRoles={['customer', 'admin', 'subadmin']} />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
        
        <Route element={<ProtectedRoute allowedRoles={['admin', 'subadmin']} />}>
          <Route path="/admin-user" element={<AdminPanel />} />
          <Route path="/edit-user-profile/:id?" element={<EditUser />} />
          <Route path="/add-user-profile" element={<AddUser />} />
        </Route>
      </Routes>
    </ThemeProvider>
  );
};

export default App;