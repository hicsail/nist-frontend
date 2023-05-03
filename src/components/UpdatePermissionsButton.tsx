import React from 'react';
import { gql, useMutation } from '@apollo/client';
import { Snackbar } from '@mui/material';
import Button from '@mui/material/Button';
import { useState } from 'react';

const CARGO_UPDATE_BUCKET_PERMISSIONS = gql`
  mutation cargoChangePermissions($change : CargoPermissionChange!, $user: String!, $bucket: String!) {
    cargoChangePermissions(change: $change, user: $user, bucket: $bucket) {
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

export function HandleUpdate({ user }: any) {
    
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [updateMessage, setUpdateMessage] = useState('');
    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };
    // update mutation
    const [cargoUpdateBucketPermission] = useMutation(CARGO_UPDATE_BUCKET_PERMISSIONS, {
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
        onCompleted: (data) => {
            setUpdateMessage('Permissions updated');
            setSnackbarOpen(true);
        },
        onError: (error) => {
            setUpdateMessage(error.message);
            setSnackbarOpen(true);
        }
    });

    const handleUpdate = () => {
        cargoUpdateBucketPermission();
    }

    return (
        <>
            <Button onClick={handleUpdate}>
                Update
            </Button>
            <Snackbar
                open={snackbarOpen}
                message={updateMessage}
                autoHideDuration={3000}
                onClose={handleCloseSnackbar}
            />
        </>
    );
}
