
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getUserId } from '../components/common/index.tsx';
import { ALL_ORDERS_URL, ORDERS_STATUS_URL, ORDERS_URL, PLACE_ORDERS_URL, GET_ALL_ORDERS_URL } from '../constants/url.ts';
import { useDataService } from '../services/index.tsx';


export const useOrders = () => {

    const placeOrder = async () => {
        try {
            const response = await useDataService.postService(`${PLACE_ORDERS_URL}?userId=${getUserId()}`);
            if (response.status === 200) {
                toast.success('Cart added successfully', { position: 'top-center' });
                return response.data;
            } else {
                toast.error(response.message || 'Failed to add Cart', { position: 'top-center' });
            }
        } catch (err) {
            console.error('Error adding Cart:', err.message);
            toast.error(err.message, { position: 'top-center' });
        }
    };

    const getOrders = async () => {
        try {
            const response = await useDataService.getService(`${ALL_ORDERS_URL}?userId=${getUserId()}`);
            if (response.status === 200) {
                toast.success('Order fetched successfully', { position: 'top-center' });
                return response.data;
            } else {
                toast.error(response.message || 'Failed to add Order', { position: 'top-center' });
            }
        } catch (err) {
            console.error('Error adding Order:', err.message);
            toast.error(err.message, { position: 'top-center' });
        }
    };

    const getOrdersByAdmin = async (userId: any) => {
        try {
            const response = await useDataService.getService(`${ALL_ORDERS_URL}?userId=${userId}`);
            if (response.status === 200) {
                toast.success('Order fetched successfully', { position: 'top-center' });
                return response.data;
            } else {
                toast.error(response.message || 'Failed to add Order', { position: 'top-center' });
            }
        } catch (err) {
            console.error('Error adding Order:', err.message);
            toast.error(err.message, { position: 'top-center' });
        }
    };

    const getAllOrdersByAdmin = async () => {
        try {
            const response = await useDataService.getService(GET_ALL_ORDERS_URL);
            if (response.status === 200) {
                toast.success('Order fetched successfully', { position: 'top-center' });
                return response.data;
            } else {
                toast.error(response.message || 'Failed to add Order', { position: 'top-center' });
            }
        } catch (err) {
            console.error('Error adding Order:', err.message);
            toast.error(err.message, { position: 'top-center' });
        }
    };

    const getOrderById = async (orderId: any) => {
        try {
            const response = await useDataService.getService(`${ORDERS_URL}/${orderId}`);

            if (response.status === 200) return response?.data;
            else {
                toast.error('Failed to retrive Cart Data', {
                    position: 'top-center',
                });
            }
        } catch (error) {
            console.error('Internal Server Error', error);
            toast.error('Internal Server Error', {
                position: 'top-center',
            });
        }
    };

    const updateOrderStatus = async (orderId: any, status?: string) => {
        try {
            const response = await useDataService.putService(`${ORDERS_URL}/${orderId}/${ORDERS_STATUS_URL}`, {status: status});
            if (response.status === 200) {
                toast.success('Product Updated Successfully', { position: 'top-center' });
                return response.data;
            } else {
                toast.error(response.message, { position: 'top-center' });
            }
        } catch (err) {
            console.error('Error updating user:', err.message);
            toast.error(err.message, { position: 'top-center' });
        }
    };

    return { placeOrder, getOrderById, updateOrderStatus, getOrders, getOrdersByAdmin, getAllOrdersByAdmin };
}
