import React, { useEffect, useState, useContext } from 'react';
import {
    TextField,
    MenuItem,
    InputLabel,
    Select,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Checkbox,
    Snackbar,
    Button,
} from '@mui/material';
import { useQuery, gql } from '@apollo/client';
import { PermissionsContext } from '../contexts/Permissions';
import { HandleUpdate } from '../components/UpdatePermissionsButton';
import { UIContext } from '../contexts/UI';

const CARGO_GET_ALL_BUCKET_PERMISSIONS = gql`
    query CargoGetAllBucketPermissions($bucket: String!) {
      cargoGetAllBucketPermissions(bucket: $bucket) {
        _id
        user {
          id
          email
        }
        bucket
        read
        write
        delete
        admin
      }
    }
  `;

type User = {
    id: number;
    name: string;
    read: boolean;
    write: boolean;
    delete: boolean;
    admin: boolean;
};

const AccessManager = () => {
    const [userPermissions, setUserPermissions] = useState<any>([]);
    const [searchText, setSearchText] = useState('');
    const [organizationsWithAdminAccess, setOrganizationsWithAdminAccess] = useState<any[]>([]);
    const [currentOrganization, setCurrentOrganization] = useState('');
    const [updateMessage, setUpdateMessage] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);

    const permissions = useContext(PermissionsContext);
    const { path, setPath } = useContext(UIContext);

    const { loading, error, data } = useQuery(CARGO_GET_ALL_BUCKET_PERMISSIONS, {
        variables: { bucket: currentOrganization },
        onCompleted: (data) => {
            console.log(data);
        }
    });

    useEffect(() => {
        const organizationsWithAdminAccess = permissions.filter((permission) => permission.admin);
        setOrganizationsWithAdminAccess(organizationsWithAdminAccess);

        if (organizationsWithAdminAccess.length > 0) {
            setCurrentOrganization(organizationsWithAdminAccess[0].bucket);
        }
    }, [permissions]);

    useEffect(() => {
        setUserPermissions(data?.cargoGetAllBucketPermissions);
    }, [data]);

    useEffect(() => {
        if (path){
            setPath([]);
        }

    },[]);

    const handleSearchChange = (event: any) => {
        setSearchText(event.target.value);
    };

    const handlePermissionChange = (index: number, permissionType: any, isChecked: boolean) => {
        // update permissions in state
        const updatedPermissions = [...userPermissions];
        const updatedPermission = {
            ...updatedPermissions[index],
            [permissionType]: isChecked,
        };    
        updatedPermissions[index] = updatedPermission;
        setUserPermissions(updatedPermissions);
    };

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    const filteredUserPermissions = userPermissions ? userPermissions.filter((userPermission: any) =>
        userPermission.user.email.toLowerCase().includes(searchText.toLowerCase())
    ) : [];

    if (error) {
        return <p>Error fetching access manager: {error.message}</p>;
    }

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            <h1>Manage Access</h1>
            {organizationsWithAdminAccess.length === 0 ? (
                <p>You have no organizations with admin access.</p>
            ) : (
                <>
                    <TextField
                        id="outlined-basic"
                        label="Search Users"
                        variant="outlined"
                        fullWidth
                        value={searchText}
                        onChange={handleSearchChange}
                    />
                    <InputLabel id="select-organization-label" style={{ marginTop: 20 }}>Choose an Organization</InputLabel>
                    <Select
                        style={{ width: 300 }}
                        id="select-organization"
                        label="Select an Organization"
                        value={currentOrganization}
                        onChange={(event) => setCurrentOrganization(event.target.value)}
                    >
                        {organizationsWithAdminAccess.map(({ bucket }) => (
                            <MenuItem value={bucket} key={bucket}>
                                {bucket}
                            </MenuItem>
                        ))}
                    </Select>
                    <TableContainer style={{ marginTop: 50 }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Email</TableCell>
                                    <TableCell>Read</TableCell>
                                    <TableCell>Write</TableCell>
                                    <TableCell>Delete</TableCell>
                                    <TableCell>Admin</TableCell>
                                    <TableCell>Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredUserPermissions.map((userPermission: any, index: number) => (
                                    <TableRow key={userPermission._id}>
                                        <TableCell>{userPermission.user.email}</TableCell>
                                        <TableCell>
                                            <Checkbox
                                                checked={userPermission.read}
                                                onChange={(event) =>
                                                    handlePermissionChange(index, 'read', event.target.checked)
                                                }
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Checkbox
                                                checked={userPermission.write}
                                                onChange={(event) =>
                                                    handlePermissionChange(index, 'write', event.target.checked)
                                                }
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Checkbox
                                                checked={userPermission.delete}
                                                onChange={(event) =>
                                                    handlePermissionChange(index, 'delete', event.target.checked)
                                                }
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Checkbox
                                                checked={userPermission.admin}
                                                onChange={(event) =>
                                                    handlePermissionChange(index, 'admin', event.target.checked)
                                                }
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <HandleUpdate user={userPermission} />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Snackbar
                        open={snackbarOpen}
                        message={updateMessage}
                        autoHideDuration={3000}
                        onClose={handleCloseSnackbar}
                    />
                </>
            )}
        </div>
    );
};

export default AccessManager;

