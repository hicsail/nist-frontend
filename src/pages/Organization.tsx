import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import { createFolder, getOrganizationContents } from '../aws-client';
import BiologyLabFilesTable from '../components/FileViewer';
import FileUploader from '../components/FileUploader';
import { S3FileViewer } from '../components/S3FileViewer';
import { InstitutionFiles } from '../components/InstitutionFiles';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, CircularProgress, Snackbar } from '@mui/material';
import { Alert } from '@mui/material';
import S3Display from '../components/S3Display';
import { client } from '../aws-client';

export default function Organization(props: any) {
  const location = useLocation();
  const organization = location.state;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [folderName, setFolderName] = useState('');
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [hasCreatedFolder, setHasCreatedFolder] = useState(false);
  const [error, setError] = useState(null);

  const handleFolderNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFolderName(event.target.value);
  };

  const handleCreateFolder = async () => {
    setIsCreatingFolder(true);
    try {
      await createFolder(organization.bucket, folderName);
      setHasCreatedFolder(true);
    } catch (error: any) {
      setError(error);
    } finally {
      setIsCreatingFolder(false);
      setIsModalOpen(false);
    }
  };



  return (
    <div>
      <h2>{organization.name}</h2>
      <Button variant="contained" startIcon={<i className="fa fa-folder-plus" aria-hidden="true"></i>} onClick={() => setIsModalOpen(true)}>
        Create Folder
      </Button>
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
      <FileUploader s3BucketName={location.state.bucket} />
      <S3Display s3BucketName={location.state.bucket} />
    </div>
  )
}
