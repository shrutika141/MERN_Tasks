import React from 'react';
import { Route, Routes } from 'react-router-dom';

import { Login } from '../views/authentication/login.tsx';
import { Register } from '../views/authentication/register.tsx';
import { ProtectedRoute } from './protectedRoutes.tsx';
import { EditUser } from '../views/users/editUsers.tsx';
import { AddUser } from '../views/users/addUser.tsx';
import { AddProduct } from '../views/products/admin/addProduct.tsx';
import { EditProduct } from '../views/products/admin/editProduct.tsx';
import { UserProduct } from '../views/products/userProduct.tsx';
import { UserCarts } from '../views/orders/userCarts.tsx';
import { OrderDetails } from './../views/orders/orderDetails.tsx';
import { UserOrders } from '../views/orders/userOrders.tsx';
import { Products } from '../views/products/admin/products.tsx';
import { Orders } from '../views/orders/admin/ordersList.tsx';
import { Users } from '../views/users/users.tsx';
import { OrderStatus } from './../views/orders/admin/orderStatus.tsx';

export const Routing = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route element={<ProtectedRoute allowedRoles={['customer', 'admin', 'subadmin']} />}>
        <Route path="/dashboard" element={<UserProduct />} />
        <Route path="/show-cart" element={<UserCarts />} />
        <Route path="/order-details/:id" element={<OrderDetails />} />
        <Route path="/get-order" element={<UserOrders />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={['admin', 'subadmin']} />}>
        <Route path="/admin-user" element={<Users />} />
        <Route path="/edit-user-profile/:id?" element={<EditUser />} />
        <Route path="/add-user-profile" element={<AddUser />} />
        <Route path="/admin-product" element={<Products />} />
        <Route path="/add-product" element={<AddProduct />} />
        <Route path="/edit-product/:id?" element={<EditProduct />} />
        <Route path="/admin-orders/:id?" element={<Orders />} />
        <Route path="/admin-status-update/:id?" element={<OrderStatus />} />
      </Route>
    </Routes>
  );
};