import React, { useEffect, useState, useContext } from 'react'
import { useLocation } from 'react-router-dom';
import { createFolder, getOrganizationContents } from '../aws-client';
import FileUploader from '../components/FileUploader';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, CircularProgress, Snackbar } from '@mui/material';
import { Alert } from '@mui/material';
import S3Display from '../components/S3Display';
import { PermissionsContext } from "../contexts/Permissions";
import Chip from '@mui/material/Chip';
import { S3Context } from '../contexts/s3.context';
import { UIContext } from '../contexts/UI';

type Permission = {
  _id: string,
  user: string,
  org: any,
  read: boolean,
  write: boolean,
  delete: boolean,
  admin: boolean,
  bucket: string
};

export default function Organization(props: any) {
  const location = useLocation();
  const organization = location.state;
  const [userPermissions, setUserPermissions] = useState<any>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [folderName, setFolderName] = useState('');
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [hasCreatedFolder, setHasCreatedFolder] = useState(false);
  const [error, setError] = useState(null);
  const s3Client = useContext(S3Context);
  const { path, setPath } = useContext(UIContext);


  const handleFolderNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFolderName(event.target.value);
  };

  const handleCreateFolder = async () => {
    setIsCreatingFolder(true);
    try {
      await createFolder(s3Client, organization.bucket, folderName);
      setHasCreatedFolder(true);
    } catch (error: any) {
      setError(error);
    } finally {
      setIsCreatingFolder(false);
      setIsModalOpen(false);
    }
  };
  const permissions = useContext(PermissionsContext);

  const getPermissionsForOrganization = (bucket: string) => {
    const orgPermissions = permissions.find((permission: Permission) => permission.bucket === bucket);
    return orgPermissions;
  };

  useEffect(() => {
    if (permissions){
      const permissions = getPermissionsForOrganization(organization.bucket);
      setUserPermissions(permissions)
    }
  }, []);

  useEffect(() => {

    // if set path has been added to global context from app
    if (path) {
      // check if path includes dashboard in names
      const pathIncludesDashboard = path.some((pathItem) => pathItem.name === 'Dashboard');
      if (pathIncludesDashboard) setPath([...path, { name: organization.name, path: `/organization/${organization._id}`}]);
      else setPath([{ name: 'Dashboard', path: '/dashboard' }, { name: organization.name, path: `/organization/${organization._id}`}]);   
    }
  }, []);


  return (
    <div>
      <h2>{organization.name}</h2>
      <div style={{ padding: 10, margin: 10 }}>
        {
          (userPermissions && userPermissions.admin) ? <Chip label="Admin" color="success" /> : null
        }
        {
          (userPermissions && userPermissions.write && !userPermissions.admin) ? <Chip label="Write" color="success" /> : null
        }{
          (userPermissions && userPermissions.read && !userPermissions.admin) ? <Chip label="Read" color="success" /> : null
        }{
          (userPermissions && userPermissions.delete && !userPermissions.admin) ? <Chip label="Delete" color="success" /> : null
        }
      </div>
      {
        userPermissions && (userPermissions.admin || userPermissions.write) ? (
          <Button variant="contained" startIcon={<i className="fa fa-folder-plus" aria-hidden="true"></i>} onClick={() => setIsModalOpen(true)}>
            Create Folder
          </Button>
        ) : null
      }
      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <DialogTitle>Create New Folder</DialogTitle>
        <DialogContent>
          <TextField label="Folder Name" value={folderName} onChange={handleFolderNameChange} fullWidth />
        </DialogContent>
        <DialogActions>
          <Button disabled={!folderName || isCreatingFolder} onClick={handleCreateFolder}>
            {isCreatingFolder ? <CircularProgress size={24} /> : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError(null)}>
        <Alert severity="error" sx={{ width: '100%' }} onClose={() => setError(null)}>
          {error}
        </Alert>
      </Snackbar>
      <Snackbar open={hasCreatedFolder} autoHideDuration={6000} onClose={() => setHasCreatedFolder(false)}>
        <Alert severity="success" sx={{ width: '100%' }} onClose={() => setHasCreatedFolder(false)}>
          Folder created successfully!
        </Alert>
      </Snackbar>
      {
        userPermissions && (userPermissions.admin || userPermissions.write) ? (
          <FileUploader s3BucketName={location.state.bucket} />
        ) : null
      }
      {
        userPermissions && (userPermissions.admin || userPermissions.read) ? (
          <S3Display s3BucketName={location.state.bucket} />
        ) : null
      }
    </div>
  )
}
