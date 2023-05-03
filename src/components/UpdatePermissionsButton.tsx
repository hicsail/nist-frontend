import { Snackbar } from '@mui/material';
import Button from '@mui/material/Button';
import { useEffect, useState } from 'react';
import { useCargoChangePermissionsMutation } from '../graphql/permissions/permissions';

export function HandleUpdate({ user }: any) {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [updateMessage, setUpdateMessage] = useState('');
  const handleCloseSnackbar = () => {
      setSnackbarOpen(false);
  };

  // GraphQL mutation query
  const [cargoChangePermissions, { error, loading }] = useCargoChangePermissionsMutation();

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
      }
    });
  }

  useEffect(() => {
    // If still loading, do nothing
    if (loading) {
      return;
    }

    // Determine if message is success or failure
    let message = 'Permissions updated';
    if (error) {
      message = 'Failed to update permissions'
    }

    setUpdateMessage(message);
    setSnackbarOpen(true);
  }, [loading, error]);

  return (
    <>
      <Button onClick={handleUpdate}>Update</Button>
      <Snackbar
          open={snackbarOpen}
          message={updateMessage}
          autoHideDuration={3000}
          onClose={handleCloseSnackbar}
      />
    </>
  );
}
