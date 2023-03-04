import React from 'react'
import { Drawer, List, ListItem, ListItemButton } from '@mui/material'
import { Outlet, Link } from "react-router-dom";

export default function SideNav() {
    return (
        <div>
            <Drawer
                variant="permanent"
                anchor="left"
                open={true}
            >
                <List>
                    <ListItem>
                        <Link to={`dashboard`}>
                            <ListItemButton>
                                Dashboard
                            </ListItemButton>
                        </Link>
                    </ListItem>
                    <ListItem>
                        <Link to={`access`}>
                            <ListItemButton>
                                Control Access
                            </ListItemButton>
                        </Link>
                    </ListItem>
                    <ListItem>
                        <ListItemButton>
                            Logout
                        </ListItemButton>
                    </ListItem>
                </List>
            </Drawer>
        </div>
    )
}
