import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { ADD_USER_URL, EDIT_USERS_URL, GET_ALL_USERS_URL } from "../constants/url.ts";
import { useDataService } from "../services/index.tsx";

export const useUsers = () => {

  const getUserRole = () => {
    const user = localStorage.getItem('user');
    const role = user ? JSON.parse(user).role : 'null';
    return role
  };

  const getAllUsers = async () => {
    try {
      const response = await useDataService.getService(`${GET_ALL_USERS_URL}?role=${getUserRole()}`);

      console.log(response)
      if (response.status === 200) return response?.data;
      else {
        toast.error('Registration failed', {
          position: 'top-center',
        });
      }
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const addUser = async (userData: any) => {
    try {
      const response = await useDataService.postService(ADD_USER_URL, userData);
      if (response.status === 201) {
        toast.success('User added successfully', { position: 'top-center' });
        return response.data;
      } else {
        toast.error(response.message || 'Failed to add user', { position: 'top-center' });
      }
    } catch (err) {
      console.error('Error adding user:', err.message);
      toast.error(err.message, { position: 'top-center' });
    }
  };

  const getUserById = async (userId: any) => {
    try {
      const response = await useDataService.getService(`${EDIT_USERS_URL}/${userId}`);
      return response.data;
    } catch (err) {
      throw new Error(`API Error: ${err.message}`);
    }
  };


  const updateUser = async (userId: any, userData: any) => {
    try {
      const response = await useDataService.putService(`${EDIT_USERS_URL}/${userId}?role=${getUserRole()}`, userData);
      console.log('response', response)
      if (response.status === 200) {
        toast.success('Profile Updated Successfully', { position: 'top-center' });
        return response.data;
      } else {
        toast.error(response.message, { position: 'top-center' });
      }
    } catch (err) {
      console.error('Error updating user:', err.message);
      toast.error(err.message, { position: 'top-center' });
    }
  };

  return { getAllUsers, addUser, updateUser, getUserById, getUserRole };
}