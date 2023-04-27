import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Checkbox, Button } from '@mui/material';
import { HandleUpdate } from './UpdatePermissionsButton';

type User = {
  id: number;
  name: string;
  read: boolean;
  write: boolean;
  delete: boolean;
  admin: boolean;
};

type CargoPermission = {
  _id: string;
  user: string;
  bucket: string;
  read: boolean;
  write: boolean;
  delete: boolean;
  admin: boolean;
}

type Props = {
  userPermissions: any[];
};

// update cargo permissio


function UserPermissionsTable({ userPermissions }: Props) {


  const [permissions, setPermissions] = useState<any[]>([]);

  useEffect(() => {
    setPermissions(userPermissions);
  }, [userPermissions]);

  function handleCheckboxChange(event: React.ChangeEvent<HTMLInputElement>, userId: string, permission: keyof User) {
    setPermissions(permissions.map(user => {
      if (user.user.id === userId) {
        return {
          ...user,
          [permission]: event.target.checked,
        };
      }
      return user;
    }));
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>User Email</TableCell>
            <TableCell>Read</TableCell>
            <TableCell>Write</TableCell>
            <TableCell>Delete</TableCell>
            <TableCell>Admin</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {permissions ? permissions.map(user => (
            <TableRow key={user.user.id}>
              <TableCell>{user.user.email}</TableCell>
              <TableCell>
                <Checkbox checked={user.read} onChange={(event: any) => handleCheckboxChange(event, user.user.id, 'read')} />
              </TableCell>
              <TableCell>
                <Checkbox checked={user.write} onChange={(event: any) => handleCheckboxChange(event, user.user.id, 'write')} />
              </TableCell>
              <TableCell>
                <Checkbox checked={user.delete} onChange={(event: any) => handleCheckboxChange(event, user.user.id, 'delete')} />
              </TableCell>
              <TableCell>
                <Checkbox checked={user.admin} onChange={(event: any) => handleCheckboxChange(event, user.user.id, 'admin')} />
              </TableCell>
              <TableCell>
                <HandleUpdate user={user} />
              </TableCell>
            </TableRow>
          )) : null
          }
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default UserPermissionsTable;
