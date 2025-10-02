'use client'
import { Inventory as StockIcon } from '@mui/icons-material';
import MenuIcon from '@mui/icons-material/Menu';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import * as React from 'react';


import { useRouter } from 'next/navigation';


// const pages = ['Products', 'Categories']; // UNUSED

export default function ResponsiveAppBar() {
  const router = useRouter()

  const [anchorElNav, setAnchorElNav] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <StockIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component="a"
            onClick={() => router.push('/')}
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'Inter, sans-serif',
              fontWeight: 600,
              letterSpacing: '0.05rem',
              color: 'inherit',
              textDecoration: 'none',
              cursor: 'pointer',
            }}
          >
            Stock Management
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: 'block', md: 'none' } }}
            >

              <MenuItem key={1} onClick={() => router.push('/product')}>
                <Typography sx={{ textAlign: 'center' }}>Products</Typography>
              </MenuItem>
              <MenuItem key={2} onClick={() => router.push('/category')}>
                <Typography sx={{ textAlign: 'center' }}>Categories</Typography>
              </MenuItem>
              <MenuItem key={3} onClick={() => router.push('/customer')}>
                <Typography sx={{ textAlign: 'center' }}>Customers</Typography>
              </MenuItem>

            </Menu>
          </Box>
          <StockIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component="a"
            onClick={() => router.push('/')}
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'Inter, sans-serif',
              fontWeight: 600,
              letterSpacing: '0.05rem',
              color: 'inherit',
              textDecoration: 'none',
              cursor: 'pointer',
            }}
          >
            Stock Mgmt
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            <Button
              key={1}
              onClick={() => router.push('/product')}
              sx={{ my: 2, color: 'white', display: 'block', fontWeight: 500 }}
            >
              Products
            </Button>

            <Button
              key={2}
              onClick={() => router.push('/category')}
              sx={{ my: 2, color: 'white', display: 'block', fontWeight: 500 }}
            >
              Categories
            </Button>

            <Button
              key={3}
              onClick={() => router.push('/customer')}
              sx={{ my: 2, color: 'white', display: 'block', fontWeight: 500 }}
            >
              Customers
            </Button>

            {/* {pages.map((page) => (
              <Button
                key={page}
                onClick={handleCloseNavMenu}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                {page}
              </Button>
            ))} */}
          </Box>
        </Toolbar>
      </Container>
    </AppBar >
  );
}
