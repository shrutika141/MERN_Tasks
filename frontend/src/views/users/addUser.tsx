import React, { useState, useEffect } from 'react';
import { TextField, Button, Grid, Typography, Container, Paper, Box, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useUsers } from '../../hooks/useUsers.tsx';
import { useNavigate, useParams } from 'react-router';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const validationSchema = Yup.object({
    username: Yup.string().required('Username is required'),
    email: Yup.string().email('Invalid email format').required('Email is required'),
    role: Yup.string().required('Role is required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is Required'),
});

export const AddUser = () => {
    const navigate = useNavigate();
    const { addUser } = useUsers();

    const { control, handleSubmit, setValue, reset, formState: { errors } } = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues: {
            username: '',
            email: '',
            role: '',
            password: ''
        },
    });

    useEffect(() => {
        reset({
            username: '',
            email: '',
            role: '',
            password: ''
        });
    }, [reset]);

    const onSubmit = async (data) => {
        try {
            await addUser(data);
            toast.success('User added successfully', {
                position: 'top-center',
            });
            navigate('/admin-user');
        } catch (err) {
            console.error('Error adding user:', err);
            toast.error(err.message, {
                position: 'top-center',
            });
        }
    };

    return (
        <Container className='container'>
            <Paper className="login-wrapper">
                <Typography component="h1" variant="h5" className="main-heading">
                    Add User
                </Typography>
                <form className="form" onSubmit={handleSubmit(onSubmit)}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Controller
                                name="username"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        className="textfield"
                                        variant="outlined"
                                        fullWidth
                                        id="username"
                                        label="Username"
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
                                        className="textfield"
                                        variant="outlined"
                                        fullWidth
                                        id="email"
                                        label="Email Address"
                                        error={Boolean(errors.email)}
                                        helperText={errors.email?.message}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Controller
                                name="role"
                                control={control}
                                render={({ field }) => (
                                    <FormControl variant="outlined" fullWidth error={Boolean(errors.role)}>
                                        <InputLabel id="role-label">Select Role</InputLabel>
                                        <Select
                                            {...field}
                                            labelId="role-label"
                                            id="role"
                                            label="Select Role"
                                        >
                                            <MenuItem value="admin">Admin</MenuItem>
                                            <MenuItem value="subadmin">Subadmin</MenuItem>
                                            <MenuItem value="customer">Customer</MenuItem>
                                        </Select>
                                        {errors.role && <Typography color="error">{errors.role.message}</Typography>}
                                    </FormControl>
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
                                        id="password"
                                        label="Enter Password"
                                        type="password"
                                        error={Boolean(errors.password)}
                                        helperText={errors.password?.message}
                                    />
                                )}
                            />
                        </Grid>
                    </Grid>
                    <Box mt={2}>
                        <Button
                            fullWidth
                            variant="outlined"
                            color="primary"
                            className="submit-btn"
                            onClick={() => navigate('/admin-user')}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className="submit-btn"
                        >
                            Add User
                        </Button>
                    </Box>
                </form>
            </Paper>
        </Container>
    );
};
