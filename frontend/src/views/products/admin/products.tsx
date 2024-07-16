import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

import { TableComponent } from '../../../components/tableComponent/index.tsx'
import { useProduct } from '../../../hooks/useProducts.tsx';
import { PRODUCT_COLUMN } from '../../../constants/products.ts';

export const Products = () => {

  const navigate = useNavigate()
  const { getAllProduct, getUserRole, deleteProduct } = useProduct();

  const [tableData, setTableData] = useState<any>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const data = await getAllProduct();
      setTableData(mapTableData(data))
    } catch (err) {
      console.log('error', err)
    } finally {
      setIsLoading(false);
    }
  };

  const mapTableData = (data: any) => {
    return data?.map((item: any, index: any) => ({
      sno: index + 1,
      id: item.id,
      product_name: item.product_name.charAt(0).toUpperCase() + item.product_name.slice(1),
      product_type: item.product_type,
      amount: item.amount,
      description: item.description.charAt(0).toUpperCase() + item.description.slice(1),
      isDeleted: item.isDeleted,
      createdAt: item.createdAt
    }));
  };

  const onEditClick = (data: any) => {
    navigate(`/edit-product/${data.id}`)
  }

  const onAddClick = (data: any) => {
    navigate('/add-product')
  }

  const onDeleteClick = async(data: any) => {
    await deleteProduct(data.id);
    fetchData();
  }

  return (
    <TableComponent
      rows={tableData}
      title="All Products"
      columns={PRODUCT_COLUMN}
      initialOrder="asc"
      initialOrderBy="account_name"
      isLoading={isLoading}
      onEdit={onEditClick}
      onDelete={onDeleteClick}
      onAdd={onAddClick}
      hasAdd={getUserRole() === 'admin' || getUserRole() === 'subadmin'}
      hasEdit={getUserRole() === 'admin' || getUserRole() === 'subadmin'}
      hasDelete={getUserRole() === 'admin'}
    />
  )
}