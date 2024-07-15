import React, { useState, useEffect } from 'react';
import { TextField, Button, Grid, Typography, Container, CssBaseline, Paper, Box, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
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
});

export const EditUser = () => {
    const navigate = useNavigate();
    const { id } = useParams(); // Get user ID from query parameters
    const { addUser, updateUser, getUserById } = useUsers();
    const [userData, setUserData] = useState({});
    const [error, setError] = useState(null);

    const isAddMode = !id; // Check if we are in add mode

    const { control, handleSubmit, setValue, reset, formState: { errors } } = useForm({
        mode: 'onTouched',
        resolver: yupResolver(validationSchema),
        defaultValues: {
            username: '',
            email: '',
            role: '',
        },
    });

    useEffect(() => {
        if (!isAddMode) {
            // Fetch user data only if not in add mode
            const fetchUser = async () => {
                try {
                    const user = await getUserById(id);
                    console.log('user', user)
                    setUserData(user);
                    setValue('username', user.username);
                    setValue('email', user.email);
                    setValue('role', user.role);
                } catch (err) {
                    console.error('Error fetching user:', err);
                    // setError('Failed to fetch user data');
                }
            };

            fetchUser();
        } else {
            // Reset form fields when in add mode
            reset({
                username: '',
                email: '',
                role: '',
            });
        }
    }, [id, isAddMode, setValue, getUserById, reset]);

    const onSubmit = async (data) => {
        try {
            if (isAddMode) {
                await addUser(data);
                toast.success('User added successfully', {
                    position: 'top-center',
                });
            } else {
                await updateUser(id, data);
                toast.success('User profile updated successfully', {
                    position: 'top-center',
                });
            }
            navigate('/admin-user');
        } catch (err) {
            console.error('Error updating user:', err);
            toast.error(err.message, {
                position: 'top-center',
            });
        }
    };

    return (
        <Container className='container'>
            <CssBaseline />
            <Paper className="login-wrapper">
                <Typography component="h1" variant="h5" className="main-heading">
                    {isAddMode ? 'Add User' : 'Edit Profile'}
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
                    </Grid>
                    {error && <Typography color="error">{error}</Typography>}
                    <Box>
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
                             Save Changes
                        </Button>
                    </Box>
                </form>
            </Paper>
        </Container>
    );
};