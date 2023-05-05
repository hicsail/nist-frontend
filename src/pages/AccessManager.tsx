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
    Typography,
    Tooltip,
    IconButton,
    Menu,
    Divider,
    Box,
    List,
    ListItem,
    FormControl
} from '@mui/material';
import { PermissionsContext } from '../contexts/Permissions';
import { HandleUpdate } from '../components/UpdatePermissionsButton';
import { UIContext } from '../contexts/UI';
import { useCargoGetAllBucketPermissionsQuery } from '../graphql/permissions/permissions';
import { OrganizationContext } from '../contexts/organization.context';
import { useGetOrganizationsQuery } from '../graphql/organization/organization';
import { Clear, Delete, FilterList } from '@mui/icons-material';
import FilterItem from '../components/FilterItem';

const AccessManager = () => {
    const [userPermissions, setUserPermissions] = useState<any>([]);
    const [searchText, setSearchText] = useState('');
    const [organizationsWithAdminAccess, setOrganizationsWithAdminAccess] = useState<any[]>([]);
    const [currentOrganization, setCurrentOrganization] = useState('');
    const [updateMessage, _setUpdateMessage] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [availableFilters, setAvailableFilters] = useState<string[]>(["Admin", "Read", "Write", "Delete"].sort());
    const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
    
    const [currentFilter, setCurrentFilter] = useState<any>({});

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [organizations, setOrganizations] = useState<any>([]);

    const permissions = useContext(PermissionsContext);
    const { path, setPath } = useContext(UIContext);


    const { loading, error, data } = useCargoGetAllBucketPermissionsQuery({ variables: { bucket: currentOrganization } });
    
    useGetOrganizationsQuery(
        {
            onCompleted: (data) => {
                console.log(data);
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
        if (isChecked && permissionType === 'admin') {
            updatedPermission.read = isChecked;
            updatedPermission.write = isChecked;
            updatedPermission.delete = isChecked;
        }
        updatedPermissions[index] = updatedPermission;
        setUserPermissions(updatedPermissions);
    };

    const handleRemoveFilter = (event: React.MouseEvent<HTMLButtonElement>) => {
        const filter = event.currentTarget.value;
        setAvailableFilters((prevState: string[]) => [...prevState, filter].sort());
        setSelectedFilters((prevState: string[]) => prevState.filter((item) => item !== filter).sort());
        setCurrentFilter((prevState: any) => {
            const newCurrentFilter = { ...prevState };
            delete newCurrentFilter[filter];
        
            return newCurrentFilter;
        });
    };
    
      const handleAddFilter = () => {
        const filter = availableFilters[0];
        setCurrentFilter((prevState: any) => {
            const newCurrentFilter = { ...prevState };
            newCurrentFilter[filter] = false;

            return newCurrentFilter;
        });
    
        setSelectedFilters((prevState: string[]) => [...prevState, filter].sort());
        setAvailableFilters((prevState: string[]) => prevState.slice(1));
    };

    const handleFilterClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    
    const handleFilterClose = () => {
        setAnchorEl(null);
    };

    const changeSelectedFilter = (oldFilter: string, newFilter: string, newFilterValue: boolean) => {
        setCurrentFilter((prevState: any) => {
            const newCurrentFilter = { ...prevState };
            delete newCurrentFilter[oldFilter];
            newCurrentFilter[newFilter] = newFilterValue;
        
            return newCurrentFilter;
        });
    
        setAvailableFilters((prevState: string[]) => {
            return [...prevState.filter((item) => item !== newFilter), oldFilter].sort();
        });
    
        setSelectedFilters((prevState: string[]) => {
            return [...prevState.filter((item) => item !== oldFilter), newFilter].sort();
        });
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

    if (error) {
        return <p>Error fetching access manager: {error.message}</p>;
    }

    if (loading) {
        return <p>Loading...</p>;
    }

    console.log(`availableFilters: ${availableFilters}`);
    console.log(`selectedFilters: ${selectedFilters}`);
    console.log(`currentFilter: ${JSON.stringify(currentFilter)}`);

    return (
        <div>
            <Typography variant='h1'>Manage Access</Typography>
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
                    {/* TODO: create a generic filter component */}
                    <div>
                        <Tooltip title="Filter">
                            <IconButton onClick={handleFilterClick}>
                                <FilterList />
                            </IconButton>
                        </Tooltip>
                        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleFilterClose}>
                            <Box sx={{ my: 3, mx: 2 }}>
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
                                            {
                                                organizations.find((organization: any) => organization.bucket === bucket)?.name
                                            }
                                        </MenuItem>
                                    ))}
                                </Select>
                            </Box>
                            <Divider variant="middle" />
                            <Box sx={{ my: 3, mx: 2 }}>
                                <List>
                                    {selectedFilters.map((filter) => (
                                        <ListItem key={filter}>
                                            <Tooltip title="delete">
                                                <IconButton value={filter} onClick={handleRemoveFilter}>
                                                    <Clear />
                                                </IconButton>
                                            </Tooltip>
                                            <FilterItem
                                                selected={filter}
                                                availableItems={availableFilters}
                                                onChangeSelectedFilter={changeSelectedFilter}
                                            />
                                            <Checkbox />
                                        </ListItem>
                                    ))}
                                </List>
                                <Button variant="text" onClick={handleAddFilter} disabled={availableFilters.length <= 0}>
                                    add filter
                                </Button>
                            </Box>
                        </Menu>
                    </div>
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
                                {visibleUserPermissions.map((userPermission: any, index: number) => (
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
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={filteredUserPermissions.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
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

