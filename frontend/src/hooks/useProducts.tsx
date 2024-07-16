import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { ADD_PRODUCT_URL, ADD_USER_URL, DELETE_PRODUCT_URL, EDIT_PRODUCT_URL, EDIT_USERS_URL, GET_ALL_PRODUCTS_URL, GET_ALL_USERS_URL } from "../constants/url.ts";
import { useDataService } from "../services/index.tsx";

export const useProduct = () => {

  const getUserRole = () => {
    const user = localStorage.getItem('user');
    const role = user ? JSON.parse(user).role : 'null';
    return role
  };

  const getAllProduct = async () => {
    try {
      const response = await useDataService.getService(`${GET_ALL_PRODUCTS_URL}?role=${getUserRole()}`);

      console.log(response)
      if (response.status === 200) return response?.data;
      else {
        toast.error('Failed to retrive Products Data', {
          position: 'top-center',
        });
      }
    } catch (error) {
      console.error('Internal Server Error', error);
    }
  };

  const addProduct = async (productData: any) => {
    try {
      const response = await useDataService.postService(`${ADD_PRODUCT_URL}?role=${getUserRole()}`, productData);
      if (response.status === 201) {
        toast.success('Product added successfully', { position: 'top-center' });
        return response.data;
      } else {
        toast.error(response.message || 'Failed to add product', { position: 'top-center' });
      }
    } catch (err) {
      console.error('Error adding product:', err.message);
      toast.error(err.message, { position: 'top-center' });
    }
  };

  const getProductById = async (userId: any) => {
    try {
      const response = await useDataService.getService(`${EDIT_PRODUCT_URL}/${userId}`);
      if (response.status === 200) return response?.data;
      else {
        toast.error('Failed to retrive product Data', {
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


  const updateProduct = async (userId: any, userData: any) => {
    try {
      const response = await useDataService.putService(`${EDIT_PRODUCT_URL}/${userId}?role=${getUserRole()}`, userData);
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

  const deleteProduct = async (userId: any) => {
    try {
      const response = await useDataService.putService(`${DELETE_PRODUCT_URL}/${userId}?role=${getUserRole()}`);
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

  return { getAllProduct, addProduct, updateProduct, getProductById, getUserRole, deleteProduct };
}