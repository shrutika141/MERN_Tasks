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
} from '@mui/material';
import { useNavigate } from 'react-router';

import { useCart } from '../../hooks/useCart.tsx';
import { useOrders } from '../../hooks/useOrders.tsx';

export const UserCarts = () => {

    const navigate = useNavigate();

    const { getCartItems, removeFromCart } = useCart();
    const { placeOrder } = useOrders();
    const [isLoading, setIsLoading] = useState<Boolean>(true);
    const [cartItems, setCartItems] = useState<any>([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const data = await getCartItems();

            console.log('data...', data)
            setCartItems(data);
        } catch (err) {
            console.log('error', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRemoveFromCart = async (itemId) => {
        await removeFromCart(itemId);
        fetchData()
    };

    const handlePlaceOrder = async (itemId) => {
        await placeOrder();
        fetchData()
    };

    return (
        <>
            {isLoading ? (
                <CircularProgress />
            ) : (
                <Container>
                    <Box display='flex' justifyContent='space-between'>
                        <Typography variant="h4" sx={{ mb: 2 }}>
                            Your Cart
                        </Typography>
                        <Button variant='outlined' size='small' sx={{ color: '#fff' }} onClick={() => navigate('/dashboard')}>Go Back</Button>
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {cartItems?.length > 0 ? (
                            cartItems?.map((item: any, index: any) => (
                                <Card key={index} sx={{ display: 'flex', justifyContent: 'space-between', p: 2 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <CardMedia
                                            component="img"
                                            sx={{ width: 100 }}
                                            image="https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=1372&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                                            alt=''
                                        />
                                        <CardContent>
                                            <Box>
                                                <Typography>Product Name: {item?.product?.product_name}</Typography>
                                                <Typography>Product Type: {item?.product?.product_type}</Typography>
                                            </Box>
                                            <Typography variant="body2">
                                                Description: {item?.product?.description}
                                            </Typography>
                                            <Typography>Price: {item?.product?.amount}</Typography>
                                            <Typography>Quantity: {item?.quantity}</Typography>
                                        </CardContent>
                                    </Box>
                                    <CardActions sx={{ display: 'flex', justifyContent: 'space-around', flexDirection: 'column' }}>
                                        <Button variant="outlined" onClick={() => handleRemoveFromCart(item.id)}>
                                            Delete from cart
                                        </Button>
                                        <Button variant="outlined" color="primary" onClick={() => navigate(`/order-details/${item.id}`)}>
                                            View Order Details
                                        </Button>
                                    </CardActions>
                                </Card>
                            ))
                        ) : (
                            <Typography>Your cart is empty.</Typography>
                        )}
                    </Box>
                    {cartItems?.length > 0 && (
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                            <Button variant="outlined" color="primary" onClick={handlePlaceOrder}>
                                Please Place your order
                            </Button>
                        </Box>
                    )}
                </Container>
            )}
        </>
    );
};
