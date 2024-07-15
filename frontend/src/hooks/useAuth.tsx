import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useDataService } from '../services/index.tsx';
import { LOGIN_URL, REGISTER_URL } from '../constants/url.ts';

export const useAuth = () => {
  const [user, setUser] = useState<any>(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (token && storedUser) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const register = async (username: string, email: string, password: string) => {
    try {
      const response = await useDataService.postService(REGISTER_URL, { username, email, password, role: 'customer' });
      if (response.status === 200) {
        localStorage.setItem('token', response?.token);
        localStorage.setItem('user', JSON.stringify(response?.data));
        axios.defaults.headers.common['Authorization'] = `Bearer ${response?.token}`;
        toast.success('Registration successful', {
          position: 'top-center',
        });
        setUser(response.data);
        return response.data
      } else {
        toast.error(response.message, {
          position: 'top-center',
        });
      }
    } catch (error) {
      console.error('Registration failed:', error);
      toast.error('Registration failed', {
        position: 'top-center',
      });
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await useDataService.postService(LOGIN_URL, { email, password });
      if (response.status === 200) {
        localStorage.setItem('token', response?.token);
        localStorage.setItem('user', JSON.stringify(response?.data));
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.token}`;
        setUser(response?.data);
        toast.success('Login successful', {
          position: 'top-center',
        });
        return response?.data;
      } else {
        toast.error(response.message, {
          position: 'top-center',
        });
      }
    } catch (error) {
      console.error('Login failed:', error);
      toast.error('Login failed', {
        position: 'top-center',
      });
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    toast.success('Logout successful', {
      position: 'top-center',
    });
  };

  return { user, register, login, logout };
};
