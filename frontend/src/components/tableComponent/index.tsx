import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableSortLabel,
  TableHead,
  TableRow,
  TextField,
  Link,
  CircularProgress,
  Stack,
  Box,
  Typography,
  Pagination,
  Card,
  IconButton,
} from '@mui/material';
import { currency, formatFromDate, formatYearFromDate } from '../common/index.tsx';
import { AddCircle, ArrowDropDown, Clear, Close, Edit, Search, Tune, Visibility } from '@mui/icons-material';
import Scrollbars from 'react-custom-scrollbars-2';

interface Props {
  columns: any;
  rows: any;
  initialOrder?: 'asc' | 'desc';
  initialOrderBy?: string;
  onColumnClick?: any;
  getQuery?: any;
  onAdd?: any;
  hasAdd?: any;
  hasEdit?: any;
  onEdit?: any;
  isLoading?: boolean;
  hideSearch?: boolean;
  hideHeader?: boolean;
  totalPages?: number;
  pagination?: any;
  title?: any;
  page?: any;
  onSort?: any;
  isPaginationHide?: any;
}

export const RenderIf = ({
  children,
  isTrue,
}: {
  children: any;
  isTrue: boolean | undefined;
}) => (isTrue ? children : null);

const returnLink = (row: any, column: any, onColumnClick: any) => (
  <Link
    component="button"
    onClick={() => {
      onColumnClick && onColumnClick(row, column);
    }}
    className='linkTableCell'
    data-testid="table-column-click"
  >
    {row[column.id]}
  </Link>
);

const CustomTableCell = ({
  row,
  column,
  onColumnClick,
}: any) => {
  /* eslint-disable no-else-return */
  if (column.priceColumn) {
    return <>{row[column.id] === 'N/A' ? row[column.id] : currency(row[column.id])}</>;
  } else if (column.isDateTime) {
    return <>{row[column.id] === 'N/A' ? row[column.id] : formatFromDate(row[column.id])}</>;
  } else if (column.hasColumnClick) {
    return returnLink(row, column, onColumnClick);
  }
  return row[column.id];
};


export const TableComponent = ({
  rows,
  columns,
  initialOrder = 'asc',
  initialOrderBy = '',
  onColumnClick,
  onAdd,
  hasAdd,
  onEdit,
  hasEdit,
  totalPages,
  getQuery,
  isLoading = false,
  hideSearch = false,
  hideHeader = false,
  pagination,
  title,
  page,
  onSort,
  isPaginationHide,
}: Props) => {
  type Order = 'asc' | 'desc';

  const [order, setOrder] = React.useState<Order>(initialOrder);
  const [orderBy, setOrderBy] = React.useState<string>(initialOrderBy);
  const [localRows, setLocalRows] = useState(rows);
  const [placeholder, setPlaceholder] = useState('');

  useEffect(() => {
    if (title === 'All Accounts') setPlaceholder('Account Name');
    else if (title === 'All Deals') setPlaceholder('Deal Name');
    else if (title === 'All Policies') setPlaceholder('Policy Number');
    else if (title === 'All Loans') setPlaceholder('Loan Name');
    else if (title === 'Illustrations & Statements') setPlaceholder('Policy Number');
    else if (title === 'File List') setPlaceholder('Uploaded Date');
  }, [title]);

  useEffect(() => {
    onSort && onSort(order, orderBy);
  }, [order, orderBy]);

  const onRequestSort = (event: React.MouseEvent<unknown>, property: any) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const createSortHandler =
    (property: any) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

  useEffect(() => {
    if (Array.isArray(rows)) {
      setLocalRows(rows.map((row: any) => ({ ...row, isEditMode: false })));
    }
  }, [rows]);

  return (
    <Box>
      <Card className='card' sx={{ p: 0 }}>
        <Box>
          <Box className='card-header'>
            <Typography className='card-heading'>
              {title}
            </Typography>
            <Box display="flex" justifyContent='flex-end' gap={2} alignItems="center" >
              {!hideSearch && (
                <TextField
                  variant="outlined"
                  placeholder={`Enter ${placeholder}`}
                  className='search-textfield'
                  InputProps={{
                    startAdornment: (
                      <Search style={{ color: 'gray', width: '18px', marginRight: '5px' }} />
                    ),
                  }}
                  onChange={(e) => getQuery && getQuery(e)}
                  size="small"
                />
              )}
              {
                hasAdd ? <div>
                  <IconButton onClick={onAdd} data-testid="on-add-click">
                    <AddCircle />
                  </IconButton>
                </div> : null
              }
            </Box>
          </Box>
          <Scrollbars
            className='custom-scrollbar'
            autoHeight
            autoHeightMax={5000}
          >
            <Box>
              <TableContainer className='table'>
                <Table stickyHeader>
                  <RenderIf isTrue={!hideHeader}>
                    <TableHead className="table-row">
                      <TableRow>
                        {columns.map((column: any) => {
                          if (column.isHidden) return null;
                          const columnProps: any = {};
                          if (column.width) {
                            columnProps.width = column.width;
                          }
                          if (column.noSort) {
                            return (
                              <TableCell
                                key={column.id}
                                align={
                                  column.isCenterAlign
                                    ? 'center'
                                    : column.isAlignRight ||
                                      column.priceColumn ||
                                      column.isWooCommerceCurrency
                                      ? 'right'
                                      : 'left'
                                }
                                {...columnProps}
                                style={
                                  column.isSticky
                                    ? {
                                      position: 'sticky',
                                      left: column.stickPosition,
                                      zIndex: 1,
                                    }
                                    : null
                                }
                                className='table-header'
                              >
                                {column.displayName}
                              </TableCell>
                            );
                          }
                          return (
                            <TableCell
                              key={column.id}
                              align={
                                column.isCenterAlign
                                  ? 'center'
                                  : column.isAlignRight ||
                                    column.priceColumn ||
                                    column.isWooCommerceCurrency
                                    ? 'right'
                                    : 'left'
                              }
                              {...columnProps}
                              style={
                                column.isSticky
                                  ? {
                                    position: 'sticky',
                                    left: column.stickPosition,
                                    zIndex: 1,
                                  }
                                  : null
                              }
                              className='table-header'
                            >
                              <TableSortLabel
                                active={orderBy === column.id}
                                direction={orderBy === column.id ? order : 'asc'}
                                onClick={createSortHandler(column.id)}
                              >
                                {column.displayName}
                              </TableSortLabel>
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    </TableHead>
                  </RenderIf>

                  <RenderIf isTrue={!isLoading}>
                    <TableBody>
                      {localRows === undefined || localRows?.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={columns?.length} align="center">
                            No data found
                          </TableCell>
                        </TableRow>
                      ) : (
                        localRows?.map((row: any, index: any) => (
                          <TableRow key={row.id}>
                            {columns.map((column: any, i: number) => {
                              if (column.isHidden) {
                                return null;
                              }
                              const columnProps: any = {};
                              if (column.width) {
                                columnProps.width = column.width;
                              }
                              return (
                                <TableCell
                                  key={`${row.id}${i}`}
                                  align={
                                    column.isAlignRight ||
                                      column.priceColumn ||
                                      column.isWooCommerceCurrency
                                      ? 'right'
                                      : column.isCenterAlign
                                        ? 'center'
                                        : 'left'
                                  }
                                  {...columnProps}
                                  style={
                                    column.isSticky
                                      ? {
                                        position: 'sticky',
                                        left: column.stickPosition,
                                      }
                                      : null
                                  }
                                >
                                  <CustomTableCell
                                    {...{
                                      row,
                                      column,
                                      onColumnClick,
                                    }}
                                  />
                                </TableCell>
                              );
                            })}
                            {
                              hasEdit ? <TableCell align="right">
                                <Box display='flex' justifyContent='right'>
                                  <IconButton
                                    disabled={row?.disableEdit || false}
                                    onClick={() => {
                                      onEdit(row);
                                    }}
                                    data-testid="on-edit-click"
                                  >
                                    <Edit />
                                  </IconButton>
                                </Box>
                              </TableCell> : null
                            }

                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </RenderIf>
                </Table>
                <RenderIf isTrue={isLoading}>
                  <Stack alignItems="center" style={{ margin: '5%' }}>
                    <CircularProgress />
                  </Stack>
                </RenderIf>
              </TableContainer>
            </Box>
          </Scrollbars>
        </Box>
      </Card>
      {
        !isPaginationHide ? <Pagination
          count={totalPages}
          variant="outlined"
          size="small"
          page={page}
          shape="rounded"
          color="primary"
          className='pagination'
          onChange={pagination}
        /> : null
      }

    </Box>
  );
};