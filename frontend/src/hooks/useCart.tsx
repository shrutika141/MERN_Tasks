import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ADD_CART_URL, CART_URL, DELETE_CART_URL } from '../constants/url.ts';
import { useDataService } from '../services/index.tsx';
import { getUserId } from '../components/common/index.tsx';



export const useCart = () => {

    const getCartItems = async () => {
        try {
            const response = await useDataService.getService(`${CART_URL}/${getUserId()}`);
            console.log('response', response)
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

    const addToCart = async (cartData: any) => {
        try {
            const response = await useDataService.postService(ADD_CART_URL, cartData);
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

    const removeFromCart = async (productId: any) => {
        try {
            const response = await useDataService.deleteService(`${DELETE_CART_URL}/${productId}?userid=${getUserId()}`);
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

    return { addToCart, getCartItems, removeFromCart };

}
