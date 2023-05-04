import { FC, useContext } from 'react'
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  Box,
  ListItemIcon,
  ListItemText
} from '@mui/material'
import { useNavigate } from "react-router-dom";
import { AuthContext } from '../contexts/Auth';
import logo from '../assets/nist-logo.png';
import StarIcon from '@mui/icons-material/Star';

export const SideNav: FC = () => {
  const drawerWidth = 256;

  const { setIsAuthenticated, setToken } = useContext(AuthContext);
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('token');
    setToken("");
    setIsAuthenticated(false);
    navigate('/login');
  }

  return (
    <Drawer
      variant='permanent'
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
        },
      }}
      anchor='left'
    >

    <Box
      component='img'
      sx={{
        height: 131,
        width: drawerWidth
      }}
      alt='NIST Racer Logo'
      src={logo}
    />

    <Box
      sx={{
        marginRight: '8px',
        marginLeft: '8px',
        marginBottom: '16px',
        height: '40px'
      }}
    >
    </Box>

    <List>
      <ListItem>
        <ListItemButton component='a' href='/dashboard'>
          <ListItemIcon>
            <StarIcon />
          </ListItemIcon>
          <ListItemText primary='Dashboard' />
        </ListItemButton>
      </ListItem>

      <ListItem>
        <ListItemButton component='a' href='/access-manager'>
          <ListItemIcon>
            <StarIcon />
          </ListItemIcon>
          <ListItemText primary='Permissions' />
        </ListItemButton>
      </ListItem>

      <ListItem>
        <ListItemButton onClick={logout}>
          <ListItemIcon>
            <StarIcon />
          </ListItemIcon>
          <ListItemText primary='Logout' />
        </ListItemButton>
      </ListItem>
    </List>

    </Drawer>
  );
}
