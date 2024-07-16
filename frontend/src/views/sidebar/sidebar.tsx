import React, { useEffect, useState } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import {
  Box,
  Drawer,
  CssBaseline,
  AppBar,
  AppBarProps as MuiAppBarProps,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText
} from '@mui/material/';
import {
  LocalShipping,
  ManageAccounts,
  Menu,
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
  Receipt,
  Logout
} from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';

import { getUserRole } from '../../components/common/index.tsx';

const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}px`,
  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBarSidebar = styled(AppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

export const Sidebar = () => {

  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const userRole = getUserRole();

  const [open, setOpen] = useState<boolean>(false);
  const [title, setTitle] = useState<String>('');

  const adminItems = [
    { text: 'User Accounts', icon: <ManageAccounts />, route: '/admin-user' },
    { text: 'Products', icon: <LocalShipping />, route: '/admin-product' },
    { text: 'Orders', icon: <LocalShipping />, route: '/admin-orders' },
    { text: 'Logout', icon: <Logout />, },
  ];

  const customerItems = [
    { text: 'Products', icon: <LocalShipping />, route: '/dashboard' },
    { text: 'Your Orders', icon: <Receipt />, route: '/get-order' },
    { text: 'Your Cart', icon: <ShoppingCart />, route: '/show-cart' },
    { text: 'Logout', icon: <Logout />,  },
  ];

  const items = userRole === 'customer' ? customerItems : adminItems;

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleNavigation = (item: any) => {
    if(item.text === 'Logout') {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      navigate('/')
    }
    else navigate(item.route);
    setOpen(!open);
  };

  useEffect(() => {
    const currentPath = location.pathname;
    const foundIndex = items.findIndex(item => {
      const routeRegex = new RegExp(`^${item.route}(/|$)`);
      return routeRegex.test(currentPath);
    });
    if (foundIndex !== -1) {
      setTitle(items[foundIndex].text);
    }
  }, [location, items]);

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBarSidebar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, ...(open && { display: 'none' }) }}
          >
            <Menu />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            {title}
          </Typography>
        </Toolbar>
      </AppBarSidebar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? <ChevronLeft /> : <ChevronRight />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {items.map((item, index) => (
            <ListItem key={index} disablePadding>
              <ListItemButton onClick={() => handleNavigation(item)}>
                <ListItemIcon>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Main open={open}>
        <DrawerHeader />
      </Main>
    </Box>
  );
};
