import React, { useContext } from 'react'
import { Drawer, List, ListItem, ListItemButton } from '@mui/material'
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from '../contexts/Auth';
import logo from '../assets/nist-logo.png';

export default function SideNav() {

    const { setIsAuthenticated, setToken } = useContext(AuthContext);
    const navigate = useNavigate();
    
    const logout = () => {
        localStorage.removeItem('token');
        setToken("");
        setIsAuthenticated(false);
        navigate('/login');
    }

    return (
        <div>
            <Drawer
                variant="permanent"
                anchor="left"
                open={true}
            >
                <div>
                    <img src={logo} alt="NIST Logo" style={{width: 150, height: 100}}/>
                </div>
                <List>
                    <ListItem>
                        <Link to={`dashboard`}>
                            <ListItemButton>
                                Dashboard
                            </ListItemButton>
                        </Link>
                    </ListItem>
                    <ListItem>
                        <Link to={`access-manager`}>
                            <ListItemButton>
                                Control Access
                            </ListItemButton>
                        </Link>
                    </ListItem>
                    <ListItem>
                        <ListItemButton onClick={logout}>
                            Logout
                        </ListItemButton>
                    </ListItem>
                </List>
            </Drawer>
        </div>
    )
}
