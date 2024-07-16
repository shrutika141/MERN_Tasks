import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from '@mui/material';

import { useOrders } from '../../../hooks/useOrders.tsx';

export const OrderStatus = () => {

  const navigate = useNavigate();
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
      const updatedStatus = await updateOrderStatus(id, status);
      navigate(`/admin-orders/${updatedStatus.userId}`)
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
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Update Order Status
              </Typography>
              <Typography variant="body1">
                Order ID: {order.id}
              </Typography>
              <Typography variant="body1">
                Current Status: {order.status}
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
            </CardContent>
          </Card>
        )
      )}
    </Container>
  );
};
