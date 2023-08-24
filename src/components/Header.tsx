import { AppBar, Toolbar, IconButton, Typography, Button, Box } from '@mui/material';
import { Menu } from '@mui/icons-material';
import logo from '../assets/header-logo.svg';
import React from 'react';

interface HeaderProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Header({ open, setOpen }: HeaderProps) {
  return (
    <AppBar sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar sx={{ backgroundColor: 'white' }}>
        <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 4, ml: 2 }} onClick={() => setOpen(!open)}>
          <Menu sx={{ color: 'black' }} />
        </IconButton>
        <Box
          component="img"
          sx={{
            height: 40,
            width: 45
          }}
          alt="NIST Racer Logo"
          src={logo}
        />
        <Typography variant="h3" component="div" sx={{ flexGrow: 1, color: 'black', ml: 10, fontWeight: 700 }}>
          Antigen Racer
        </Typography>
        <Button color="inherit">Login button</Button>
      </Toolbar>
    </AppBar>
  );
}
