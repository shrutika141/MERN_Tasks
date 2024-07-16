import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { ADD_USER_URL, EDIT_USERS_URL, GET_ALL_USERS_URL } from "../constants/url.ts";
import { useDataService } from "../services/index.tsx";
import { getUserRole } from '../components/common/index.tsx';

export const useUsers = () => {



  const getAllUsers = async () => {
    try {
      const response = await useDataService.getService(`${GET_ALL_USERS_URL}?role=${getUserRole()}`);

      if (response.status === 200) return response?.data;
      else {
        toast.error('Failed to retrive Users Data', {
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

  const addUser = async (userData: any) => {
    try {
      const response = await useDataService.postService(`${ADD_USER_URL}?role=${getUserRole()}`, userData);
      if (response.status === 200) {
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
      if (response.status === 200) return response?.data;
      else {
        toast.error('Failed to retrive User Data', {
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


  const updateUser = async (userId: any, userData: any) => {
    try {
      const response = await useDataService.putService(`${EDIT_USERS_URL}/${userId}?role=${getUserRole()}`, userData);
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

  return { getAllUsers, addUser, updateUser, getUserById };
}