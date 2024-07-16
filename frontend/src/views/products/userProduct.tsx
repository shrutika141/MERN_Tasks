import React, { useEffect, useState } from 'react';
import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    CardMedia,
    CircularProgress,
    Container,
    Typography,
    IconButton,
} from '@mui/material';
import { Add, Remove, ShoppingCart } from '@mui/icons-material';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router';

import { useProduct } from '../../hooks/useProducts.tsx';
import { useCart } from '../../hooks/useCart.tsx';
import { getUserId } from '../../components/common/index.tsx';


export const UserProduct = () => {

    const navigate = useNavigate();

    const { getAllProduct } = useProduct();
    const { addToCart } = useCart();
    const [isLoading, setIsLoading] = useState(true);
    const [products, setProducts] = useState([]);
    const [quantities, setQuantities] = useState({});

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const data = await getAllProduct();
            setProducts(data);
            const initialQuantities = data.reduce((acc, product) => {
                acc[product.id] = 1;
                return acc;
            }, {});
            setQuantities(initialQuantities);
        } catch (err) {
            console.log('error', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddToCart = async (productId) => {
        try {
            const payload = {
                userId: getUserId(),
                productId: productId,
                quantity: quantities[productId]
            }
            await addToCart(payload);
            toast.success('Product added to Cart', { position: 'top-center' });
        } catch (err) {
            console.log('error', err);
            alert('Failed to add product to cart');
        }
    };

    const handleIncreaseQuantity = (productId) => {
        setQuantities((prevQuantities) => ({
            ...prevQuantities,
            [productId]: prevQuantities[productId] + 1,
        }));
    };

    const handleDecreaseQuantity = (productId) => {
        setQuantities((prevQuantities) => ({
            ...prevQuantities,
            [productId]: Math.max(prevQuantities[productId] - 1, 1),
        }));
    };

    return (
        <>
            {isLoading ? (
                <CircularProgress />
            ) : (
                <Container>
                    <Box display='flex' justifyContent='end'>
                        <IconButton size='small' onClick={() => navigate('/show-cart')}><ShoppingCart /> </IconButton>

                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                        {products?.map((item: any, index: any) => (
                            <Card sx={{ minWidth: 345, maxWidth: 345, marginTop: '20px' }} key={index}>
                                <CardMedia
                                    sx={{ height: 140 }}
                                    image="https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=1372&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                                    title="green iguana"
                                />
                                <CardContent>
                                    <Box>
                                        <Typography>Product Name: {item.product_name}</Typography>
                                        <Typography>Product Type: {item.product_type}</Typography>
                                    </Box>
                                    <Typography variant="body2" color="text.secondary">
                                        Description: {item.description}
                                    </Typography>
                                    <Typography>Price: {item.amount}</Typography>
                                </CardContent>
                                <CardActions>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <IconButton onClick={() => handleDecreaseQuantity(item.id)}>
                                            <Remove />
                                        </IconButton>
                                        <Typography>{quantities[item.id]}</Typography>
                                        <IconButton onClick={() => handleIncreaseQuantity(item.id)}>
                                            <Add />
                                        </IconButton>
                                    </Box>
                                    <Button
                                        size="small"
                                        variant="outlined"
                                        color="primary"
                                        onClick={() => handleAddToCart(item.id)}
                                    >
                                        Add To Cart
                                    </Button>
                                    <Button variant="outlined" color="primary" onClick={() => navigate(`/order-details/${item.id}`)}>
                                        View Order Details
                                    </Button>
                                </CardActions>
                            </Card>
                        ))}
                    </Box>
                </Container>
            )}
        </>
    );
};