import { useContext, FC, ReactNode } from 'react';
import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/Auth';
import { FileOpen, Home, Settings, Lock, Logout } from '@mui/icons-material';

interface NavItemProps {
  action: () => void;
  name: string;
  icon: ReactNode;
}

const NavItem: FC<NavItemProps> = ({ action, icon, name }) => {
  return (
    <ListItem>
      <ListItemButton component="a" onClick={action}>
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText primary={name} />
      </ListItemButton>
    </ListItem>
  );
}

interface SideNavProps {
  open: boolean;
}

export const SideNav: FC<SideNavProps> = ({ open }) => {
  const drawerWidth = 256;

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

  const navItems: NavItemProps[] = [
    { action: () => handleNavigate('/dashboard'), name: 'Dashboard', icon: <Home /> },
    { action: () => handleNavigate('/file-view'), name: 'File View', icon: <FileOpen /> },
    { action: () => handleNavigate('/access-manager'), name: 'Permissions', icon: <Lock /> },
    { action: () => handleNavigate('/account'), name: 'Account', icon: <Settings /> },
    { action: logout, name: 'Logout', icon: <Logout /> }
  ];

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
          mt: '64px'
        }
      }}
      anchor="left"
      open={open}
    >
      <List>
        {navItems.map((navItem) => <NavItem {...navItem} key={navItem.name} />)}
      </List>
    </Drawer>
  );
}
