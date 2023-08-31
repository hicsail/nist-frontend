import { Snackbar } from '@mui/material';
import Button from '@mui/material/Button';
import { useState, FC } from 'react';
import { useCargoChangePermissionsMutation } from '../graphql/permissions/permissions';
import { CargoPermissions, Organization } from '../graphql/graphql';

interface HandleUpdateProps {
  user: CargoPermissions;
  organization: Organization;
}

export const HandleUpdate: FC<HandleUpdateProps> = ({ user, organization }) => {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [updateMessage, setUpdateMessage] = useState('');
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  // GraphQL mutation query
  const cargoChangePermissions = useCargoChangePermissionsMutation()[0];

  // On submit, change the user permissions
  const handleUpdate = async () => {
    // Make cooresponding changes to protocol bucket
    const changeRequest = {
      change: {
        read: user.read,
        write: user.write,
        delete: user.delete,
        admin: user.admin
      },
      user: user.user.id,
    };

    // Update the permissions for the main bucket
    const result = await cargoChangePermissions({
      variables: { ...changeRequest, bucket: organization.bucket }
    });

    // If the update failed, send message
    if (result.errors) {
      setUpdateMessage('Failed to update permissions');
      setSnackbarOpen(true);
      return;
    }

    // Update the permissions for the protocol bucket
    cargoChangePermissions({
      variables: { ...changeRequest, bucket: organization.protocolBucket }
    })
  };

  return (
    <>
      <Button onClick={handleUpdate}>Update</Button>
      <Snackbar open={snackbarOpen} message={updateMessage} autoHideDuration={3000} onClose={handleCloseSnackbar} />
    </>
  );
}
