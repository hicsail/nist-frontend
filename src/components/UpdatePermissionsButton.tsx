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
    /* Handle change on files bucket
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
    }); */

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

    console.log(result);

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
