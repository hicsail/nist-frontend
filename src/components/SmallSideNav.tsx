import React from 'react'
import { useContext } from 'react';
import { Drawer, List, ListItem, ListItemButton, ListItemIcon } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/Auth';
import HomeIcon from '@mui/icons-material/Home';
import SettingsIcon from '@mui/icons-material/Settings';
import { FolderOpen } from '@mui/icons-material';
import { LockRounded } from '@mui/icons-material';

interface SideNavProps {
  open: boolean;
}

export default function smallSideNav({open}: SideNavProps) {
  const drawerWidth = 88;

  const { setIsAuthenticated, setToken } = useContext(AuthContext);
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('token');
    setToken('');
    setIsAuthenticated(false);
    navigate('/login');
  };

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  // TODO: Add icons to the side nav bu-logo Hariri Institute and Biomade
  return (
    <Drawer
      variant="persistent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          backgroundColor: '#103F68',
          color: 'white',
          paddingTop: 18,
          mt: "64px",
          alignContent: "center",
        },
      }}
      anchor="left"
      open={open}
    >
      <List>
        <ListItem>
          <ListItemButton component="a" onClick={()=> handleNavigate("/dashboard")}>
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
          </ListItemButton>
        </ListItem>
        <ListItem>
          <ListItemButton component="a" onClick={()=> handleNavigate("/access-manager")}>
            <ListItemIcon>
              <FolderOpen />
            </ListItemIcon>
          </ListItemButton>
        </ListItem>
        {/* <ListItem>
          <ListItemButton component="a" onClick={()=> handleNavigate("/account")}>
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
          </ListItemButton>
        </ListItem> */}
        <ListItem>
          <ListItemButton onClick={logout}>
            <ListItemIcon>
              <LockRounded />
            </ListItemIcon>
          </ListItemButton>
        </ListItem>
      </List>
    </Drawer>
  );
}
