import React, { useEffect, useState } from 'react'
import { TableComponent } from '../../components/tableComponent/index.tsx'
import { USERS_COLUMN } from '../../constants/users.ts';
import { useUsers } from '../../hooks/useUsers.tsx';
import { useNavigate } from 'react-router-dom';

export const Users = () => {

  const navigate = useNavigate()
  const { getAllUsers, getUserRole } = useUsers();

  const [tableData, setTableData] = useState<any>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllUsers();
        setTableData(mapTableData(data))
      } catch (err) {
        console.log('error', err)
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const mapTableData = (data: any) => {
    return data?.map((item: any, index: any) => ({
      sno: index + 1,
      id: item.id,
      user_name: item.username.charAt(0).toUpperCase() + item.username.slice(1),
      email: item.email,
      role: item.role.charAt(0).toUpperCase() + item.username.slice(1),
      createdAt: item.createdAt
    }));
  };

  const onEditClick = (data: any) => {
    navigate(`/edit-user-profile/${data.id}`)
  }

  const onAddClick = (data: any) => {
    navigate('/add-user-profile')
  }

  return (
    <TableComponent
      rows={tableData}
      title="All Users"
      columns={USERS_COLUMN}
      initialOrder="asc"
      initialOrderBy="account_name"
      // onColumnClick={onViewClick}
      isLoading={isLoading}
      onEdit={onEditClick}
      onAdd={onAddClick}
      hasAdd={getUserRole() === 'admin'}
      hasEdit={getUserRole() === 'admin'}
    />
  )
}