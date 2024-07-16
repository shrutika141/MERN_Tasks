import React, { useEffect } from 'react';
import { TextField, Button, Grid, Typography, Container, CssBaseline, Paper, Box } from '@mui/material';
import { useNavigate, useParams } from 'react-router';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useProduct } from '../../../hooks/useProducts.tsx';

const validationSchema = Yup.object({
    product_name: Yup.string().required('Product Name is required'),
    product_type: Yup.string().required('Product Type is required'),
    amount: Yup.string().required('Amount is required'),
    description: Yup.string().required('Description is required'),
});

export const EditProduct = () => {

    const navigate = useNavigate();
    const { id } = useParams();

    const { updateProduct, getProductById } = useProduct();

    const { control, handleSubmit, setValue, reset, formState: { errors } } = useForm({
        mode: 'onTouched',
        resolver: yupResolver(validationSchema),
        defaultValues: {
            product_name: '',
            product_type: '',
            amount: '',
            description: ''
        },
    });

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const product = await getProductById(id);
                setValue('product_name', product.product_name);
                setValue('product_type', product.product_type);
                setValue('amount', product.amount);
                setValue('description', product.description);
            } catch (err) {
                console.error('Error fetching user:', err);
            }
        };

        fetchUser();

    }, [id, setValue, reset]);

    const onSubmit = async (data) => {
        try {
            await updateProduct(id, data);
            toast.success('Product updated successfully', {
                position: 'top-center',
            });
            navigate('/admin-product');
        } catch (err) {
            console.error('Error updating product:', err);
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
                    Edit Profile
                </Typography>
                <form className="form" onSubmit={handleSubmit(onSubmit)}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Controller
                                name="product_name"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        className="textfield"
                                        variant="outlined"
                                        fullWidth
                                        id="product_name"
                                        label="Product Name"
                                        error={Boolean(errors.product_name)}
                                        helperText={errors.product_name?.message}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Controller
                                name="product_type"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        className="textfield"
                                        variant="outlined"
                                        fullWidth
                                        id="product_type"
                                        label="Product Type"
                                        error={Boolean(errors.product_type)}
                                        helperText={errors.product_type?.message}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Controller
                                name="amount"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        className="textfield"
                                        variant="outlined"
                                        fullWidth
                                        id="amount"
                                        label="Price"
                                        error={Boolean(errors.amount)}
                                        helperText={errors.amount?.message}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Controller
                                name="description"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        className="textfield"
                                        variant="outlined"
                                        fullWidth
                                        id="description"
                                        label="Description"
                                        error={Boolean(errors.description)}
                                        helperText={errors.description?.message}
                                    />
                                )}
                            />
                        </Grid>
                    </Grid>
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
                            variant="outlined"
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