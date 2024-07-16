import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { TableComponent } from '../../../components/tableComponent/index.tsx';
import { ORDER_COLUMN } from '../../../constants/orders.ts';
import { useOrders } from '../../../hooks/useOrders.tsx';

export const Orders = () => {

  const navigate = useNavigate();
  const { id } = useParams();

  const { getOrdersByAdmin, getAllOrdersByAdmin } = useOrders();

  const [tableData, setTableData] = useState<any>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      let data;
      if (id) {
        data = await getOrdersByAdmin(id);
      } else {
        data = await getAllOrdersByAdmin();
      }
      setTableData(mapTableData(data));
    } catch (err) {
      console.log('Error fetching orders:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const mapTableData = (data: any) => {
    return data?.map((item: any, index: any) => ({
      sno: index + 1,
      id: item.id,
      product_name: item.product.product_name.charAt(0).toUpperCase() + item.product.product_name.slice(1),
      product_type: item.product.product_type,
      amount: item.totalAmount,
      description: item.product.description.charAt(0).toUpperCase() + item.product.description.slice(1),
      status: item.status,
      quantity: item.quantity,
    }));
  };

  const onViewClick = (data: any) => {
    navigate(`/admin-status-update/${data.id}`);
  };

  return (
    <TableComponent
      rows={tableData}
      title="All Orders"
      columns={ORDER_COLUMN}
      initialOrder="asc"
      initialOrderBy="account_name"
      isLoading={isLoading}
      onViewOrder={onViewClick}
    />
  );
};