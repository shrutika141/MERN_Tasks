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
} from '@mui/material';
import * as Yup from 'yup';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useAuth } from '../../hooks/useAuth.tsx';

const validationSchema = Yup.object({
  username: Yup.string().required('User Name is Required'),
  email: Yup.string().email('Invalid email format').required('Email is Required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is Required'),
});

export const Register = () => {

  const navigate = useNavigate();
  const { register } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

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
    const { username, email, password } = data;
    const user = await register(username, email, password);
    if (user) {
      if (user.role === 'customer') {
        navigate('/dashboard');
      } else if (user.role === 'admin' || user.role === 'subadmin') {
        navigate('/adminpanel');
      }
    }
  };

  return (
    <Container component="main" className='container'>
      <CssBaseline />
      <Paper className='login-wrapper'>
        <Typography component="h1" variant="h5" className='main-heading'>
          Register
        </Typography>
        <form className='form' onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Controller
                name="username"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    className='textfield'
                    variant="outlined"
                    fullWidth
                    id="username"
                    label="Username"
                    autoComplete="username"
                    error={Boolean(errors.username)}
                    helperText={errors.username?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    className='textfield'
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
                    className='textfield'
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
            Register
          </Button>
        </form>
        <Typography>Already have an account? <RouterLink to="/" className='link'>Login here.</RouterLink></Typography>
      </Paper>
      <ToastContainer />
    </Container>
  );
};