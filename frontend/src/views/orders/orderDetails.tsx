import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from '@mui/material';

import { useOrders } from './../../hooks/useOrders.tsx';
import { getUserRole } from '../../components/common/index.tsx';

export const OrderDetails = () => {

  const { id } = useParams();

  const { getOrderById, updateOrderStatus } = useOrders();

  const [isLoading, setIsLoading] = useState(true);
  const [order, setOrder] = useState<any>(null);
  const [status, setStatus] = useState<string>('');

  useEffect(() => {
    fetchOrderDetails();
  }, []);

  const fetchOrderDetails = async () => {
    try {
      const data = await getOrderById(id);
      setOrder(data);
      setStatus(data.status);
    } catch (err) {
      console.log('Error fetching order details:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = (event: any) => {
    setStatus(event.target.value as string);
  };

  const handleUpdateStatus = async () => {
    try {
      await updateOrderStatus(id, status);
      alert('Order status updated successfully');
    } catch (err) {
      console.log('Error updating order status:', err);
      alert('Failed to update order status');
    }
  };

  return (
    <Container>
      {isLoading ? (
        <CircularProgress />
      ) : (
        order && (
          <Card sx={{ display: 'flex', justifyContent: 'space-around', p: 2 }}>
            <CardMedia
              component="img"
              sx={{ width: 300 }}
              image="https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=1372&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt=''
            />
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Order Details
              </Typography>
              <Typography variant="body1">
                Order ID: {order.id}
              </Typography>
              <Typography variant="body1">
                Product Name: {order.product.product_name}
              </Typography>
              <Typography variant="body1">
                Quantity: {order.quantity}
              </Typography>
              <Typography variant="body1">
                Total Amount: ${order.totalAmount}
              </Typography>
              <Typography variant="body1">
                Current Status: {order.status}
              </Typography>
              {getUserRole() === 'admin' || getUserRole() === 'subadmin' ? (
                <>
                  <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                    Update Status
                  </Typography>
                  <FormControl fullWidth sx={{ mt: 2 }}>
                    <InputLabel>Status</InputLabel>
                    <Select value={status} onChange={handleStatusChange}>
                      <MenuItem value="pending">Pending</MenuItem>
                      <MenuItem value="processing">Processing</MenuItem>
                      <MenuItem value="completed">Completed</MenuItem>
                      <MenuItem value="cancelled">Cancelled</MenuItem>
                    </Select>
                  </FormControl>
                  <Box mt={2}>
                    <Button variant="outlined" color="primary" onClick={handleUpdateStatus}>
                      Update Status
                    </Button>
                  </Box>
                </>
              ) : null}
            </CardContent>
          </Card>
        )
      )}
    </Container>
  );
};