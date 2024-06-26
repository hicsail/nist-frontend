import { Snackbar } from '@mui/material';
import Button from '@mui/material/Button';
import { useState } from 'react';
import { useCargoChangePermissionsMutation } from '../graphql/permissions/permissions';

export function HandleUpdate({ user }: any) {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [updateMessage, setUpdateMessage] = useState('');
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  // GraphQL mutation query
  const cargoChangePermissions = useCargoChangePermissionsMutation()[0];

  // On submit, change the user permissions
  const handleUpdate = () => {
    cargoChangePermissions({
      variables: {
        change: {
          read: user.read,
          write: user.write,
          delete: user.delete,
          admin: user.admin
        },
        user: user.user.id,
        bucket: user.bucket
      },
      onCompleted: () => {
        let message = 'Permissions updated';
        setUpdateMessage(message);
        setSnackbarOpen(true);
      },
      onError: (_error) => {
        let message = 'Failed to update permissions';
        setUpdateMessage(message);
        setSnackbarOpen(true);
      }
    });
  };

  return (
    <>
      <Button onClick={handleUpdate}>Update</Button>
      <Snackbar open={snackbarOpen} message={updateMessage} autoHideDuration={3000} onClose={handleCloseSnackbar} />
    </>
  );
}
