import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Checkbox, Button } from '@mui/material';

type User = {
  id: number;
  name: string;
  read: boolean;
  write: boolean;
  delete: boolean;
  admin: boolean;
};

type Props = {
  users: User[];
};

function UserPermissionsTable({ users }: Props) {
  const [permissions, setPermissions] = useState<User[]>(users);

  function handleCheckboxChange(event: React.ChangeEvent<HTMLInputElement>, userId: number, permission: keyof User) {
    setPermissions(prevPermissions => {
      const userIndex = prevPermissions.findIndex(user => user.id === userId);
      const updatedUser = { ...prevPermissions[userIndex], [permission]: event.target.checked };
      const updatedPermissions = [...prevPermissions];
      updatedPermissions[userIndex] = updatedUser;
      return updatedPermissions;
    });
  }

  function handleUpdateClick() {
    // TODO: Update permissions on the server
    console.log('Updated permissions:', permissions);
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>User ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Read</TableCell>
            <TableCell>Write</TableCell>
            <TableCell>Delete</TableCell>
            <TableCell>Admin</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {permissions.map(user => (
            <TableRow key={user.id}>
              <TableCell>{user.id}</TableCell>
              <TableCell>{user.name}</TableCell>
              <TableCell>
                <Checkbox checked={user.read} onChange={(event:any) => handleCheckboxChange(event, user.id, 'read')} />
              </TableCell>
              <TableCell>
                <Checkbox checked={user.write} onChange={(event: any) => handleCheckboxChange(event, user.id, 'write')} />
              </TableCell>
              <TableCell>
                <Checkbox checked={user.delete} onChange={(event: any) => handleCheckboxChange(event, user.id, 'delete')} />
              </TableCell>
              <TableCell>
                <Checkbox checked={user.admin} onChange={(event: any) => handleCheckboxChange(event, user.id, 'admin')} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Button variant="contained" color="primary" onClick={handleUpdateClick}>Update Permissions</Button>
    </TableContainer>
  );
}

export default UserPermissionsTable;
