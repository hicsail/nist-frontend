import React, { useEffect, useState, useContext, useMemo } from 'react';
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
    Paper,
    TablePagination,
    Typography
} from '@mui/material';
import { PermissionsContext } from '../contexts/Permissions';
import { HandleUpdate } from '../components/UpdatePermissionsButton';
import { UIContext } from '../contexts/UI';
import { useCargoGetAllBucketPermissionsQuery } from '../graphql/permissions/permissions';
import { AuthContext } from '../contexts/Auth';
import { useGetOrganizationsQuery } from '../graphql/organization/organization';
import EnhancedTableHead from '../components/EnhancedTableHead';
import jwtDecode from 'jwt-decode';

type Order = 'asc' | 'desc';

interface JwtPayload {
    [key: string]: any;
}

const AccessManager = () => {
    const [userPermissions, setUserPermissions] = useState<any>([]);
    const [searchText, setSearchText] = useState('');
    const [organizationsWithAdminAccess, setOrganizationsWithAdminAccess] = useState<any[]>([]);
    const [currentOrganization, setCurrentOrganization] = useState('');
    const [updateMessage, _setUpdateMessage] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [organizations, setOrganizations] = useState<any>([]);
    const [userId, setUserId] = useState<string>('');

    const columns = [
        { label: 'Email', id: 'email' },
        { label: 'Read', id: 'read' },
        { label: 'Write', id: 'write' },
        { label: 'Delete', id: 'delete' },
        { label: 'Admin', id: 'admin' },
        { label: 'Action', id: 'action' }
    ];
    const [order, setOrder] = useState<Order>('asc');
    const [orderBy, setOrderBy] = useState<string>('email');

    const permissions = useContext(PermissionsContext);
    const { path, setPath } = useContext(UIContext);
    const { token } = useContext(AuthContext);


    const { loading, error, data } = useCargoGetAllBucketPermissionsQuery({ variables: { bucket: currentOrganization } });

    useGetOrganizationsQuery(
        {
            onCompleted: (data) => {
                setOrganizations(data.getOriganizations);
            },
            onError: (error) => {
                console.log(error);
            },
        },
    );

    useEffect(() => {
        const organizationsWithAdminAccess = permissions.filter((permission) => permission.admin);
        setOrganizationsWithAdminAccess(organizationsWithAdminAccess);
        // extract user id from token
        if (token) {
            const decodedToken = extractJwtPayload(token);
            if (decodedToken) {
                console.log(decodedToken);
                setUserId(decodedToken.id);
            }
        }
        if (organizationsWithAdminAccess.length === 1) {
            setCurrentOrganization(organizationsWithAdminAccess[0].bucket);
        }
    }, [permissions]);

    useEffect(() => {
        const orderedPermissions = data?.cargoGetAllBucketPermissions.slice().sort((a: any, b: any) => {
            if (order === 'asc') {
                return a.user[orderBy] > b.user[orderBy] ? 1 : -1;
            } else {
                return a.user[orderBy] > b.user[orderBy] ? -1 : 1;
            }
        });
        setUserPermissions(orderedPermissions);
    }, [data, order, orderBy]);

    useEffect(() => {
        if (path) {
            setPath([]);
        }
    }, []);

    const extractJwtPayload = (jwt: string): JwtPayload | null => {
        try {
            const decodedToken = jwtDecode<JwtPayload>(jwt);
            return decodedToken;
        } catch (error) {
            console.error('Error decoding JWT:', error);
            return null;
        }
    };

    const handleRequestSort = (event: React.MouseEvent<unknown>, property: string) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSearchChange = (event: any) => {
        setSearchText(event.target.value);
    };

    const handlePermissionChange = (index: number, permissionType: any, isChecked: boolean) => {
        // update permissions in state
        const actualIndex = index + page * rowsPerPage;
        const updatedPermissions = [...userPermissions];
        const updatedPermission = {
            ...updatedPermissions[actualIndex],
            [permissionType]: isChecked,
        };
        if (isChecked && permissionType === 'admin') {
            updatedPermission.read = isChecked;
            updatedPermission.write = isChecked;
            updatedPermission.delete = isChecked;
        }
        updatedPermissions[actualIndex] = updatedPermission;
        setUserPermissions(updatedPermissions);
    };

    const handleChangePage = (event: any, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: any) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    const filteredUserPermissions = userPermissions ? userPermissions.filter((userPermission: any) =>
        userPermission.user.email.toLowerCase().includes(searchText.toLowerCase())
    ) : [];

    const visibleUserPermissions = useMemo(() => {
        const firstPageIndex = page * rowsPerPage;
        const lastPageIndex = firstPageIndex + rowsPerPage;
        return filteredUserPermissions.slice(firstPageIndex, lastPageIndex);
    }, [page, rowsPerPage, filteredUserPermissions]);

    if (currentOrganization && error) {
        return <p>Error fetching access manager: {error.message}</p>;
    }

    if (currentOrganization && loading) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            <Typography variant='h1'>Manage Access</Typography>
            {organizationsWithAdminAccess.length === 0 ? (
                <p>You have no organizations with admin access.</p>
            ) : (
                <>
                    <InputLabel id="select-organization-label" style={{ marginTop: 40 }}>Select an Organization</InputLabel>
                    <Select
                        style={{ width: 300 }}
                        id="select-organization"
                        label="Select an Organization"
                        value={currentOrganization}
                        onChange={(event) => setCurrentOrganization(event.target.value)}
                    >
                        {organizationsWithAdminAccess.map(({ bucket }) => (
                            <MenuItem value={bucket} key={bucket}>
                                {
                                    organizations.find((organization: any) => organization.bucket === bucket)?.name
                                }
                            </MenuItem>
                        ))}
                    </Select>
                    {currentOrganization && <TextField
                        id="outlined-basic"
                        label="Search users by email"
                        variant="outlined"
                        fullWidth
                        value={searchText}
                        onChange={handleSearchChange}
                        style={{ marginTop: 40 }}
                    />}
                    {
                        currentOrganization ? (<TableContainer style={{ marginTop: 10 }}>
                            <Table>
                                <EnhancedTableHead
                                    onRequestSort={handleRequestSort}
                                    columns={columns}
                                    sortableIds={['email']}
                                    order={order}
                                    orderBy={orderBy}
                                />
                                <TableBody>
                                    {visibleUserPermissions.map((userPermission: any, index: number) => (
                                            userPermission.user.id != userId && (
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
                                            ) 
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>) :
                            <Typography variant='h3' style={{ marginTop: 50 }}>Select an Organization to Manage Access</Typography>
                    }
                    {currentOrganization && <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={filteredUserPermissions.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />}
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

