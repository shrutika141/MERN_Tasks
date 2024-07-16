import React, { useState } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  InputAdornment,
  IconButton,
  Paper,
  CssBaseline,
  Modal,
  Box,
} from '@mui/material';
import * as Yup from 'yup';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';

import { useAuth } from '../../hooks/useAuth.tsx';

const validationSchema = Yup.object({
  email: Yup.string().email('Invalid email format').required('Email is Required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is Required'),
});

export const Login = ({ setToken }: any) => {
  const navigate = useNavigate()
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const { control, handleSubmit, formState: { errors } } = useForm({
    mode: 'onTouched',
    resolver: yupResolver(validationSchema)
  });

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event: React.MouseEvent) => {
    event.preventDefault();
  };

  const onSubmit = async (data: any) => {
    try {
      const { email, password } = data;
      const user = await login(email, password);
      if (user) {
        if (user.role === 'admin' || user.role === 'subadmin') {
          setShowModal(true);
        } else {
          setToken(localStorage.getItem('token'))
          navigate('/dashboard');
        }
      }
    } catch(error) {
      console.log('error', error)
    }
  };

  const handleSelection = (path: string) => {
    setShowModal(false);
    setToken(localStorage.getItem('token'))
    navigate(path);
  };

  return (
    <Container className='container'>
      <CssBaseline />
      <Paper className="login-wrapper">
        <Typography component="h1" variant="h5" className="main-heading">
          Login
        </Typography>
        <form className='form' onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    className="textfield"
                    variant="outlined"
                    fullWidth
                    id="email"
                    label="Email Address"
                    autoComplete="email"
                    error={Boolean(errors.email)}
                    helperText={errors.email?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    className="textfield"
                    variant="outlined"
                    fullWidth
                    name="password"
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    autoComplete="current-password"
                    error={Boolean(errors.password)}
                    helperText={errors.password?.message}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                          >
                            {showPassword ? <Visibility /> : <VisibilityOff />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="outlined"
            color="primary"
            className="submit-btn"
          >
            Login
          </Button>
        </form>
        <Typography>Don't have an account? <RouterLink to="/register" className="link">Register here.</RouterLink></Typography>
      </Paper>
      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        className="modal"
      >
        <Box className="modalContent">
          <Typography variant="h6" gutterBottom>
            Choose your destination
          </Typography>
          <Button
            fullWidth
            variant="outlined"
            color="primary"
            onClick={() => handleSelection('/admin-user')}
            style={{ marginBottom: 16 }}
          >
            Admin Panel
          </Button>
          <Button
            fullWidth
            variant="outlined"
            color="primary"
            onClick={() => handleSelection('/dashboard')}
          >
            Dashboard
          </Button>
        </Box>
      </Modal>
    </Container>
  );
};