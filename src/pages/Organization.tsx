import React, { useEffect, useState, useContext, ReactNode, FC } from 'react'
import { useLocation, useParams } from 'react-router-dom';
import { createFolder, getOrganizationContents } from '../aws-client';
import FileUploader from '../components/FileUploader';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Snackbar,
  Breadcrumbs,
  Link,
  Typography,
  Box,
  Grid,
  Divider
} from '@mui/material';
import { Alert } from '@mui/material';
import S3Display from '../components/S3Display';
import { PermissionsContext } from "../contexts/Permissions";
import Chip from '@mui/material/Chip';
import { S3Context } from '../contexts/s3.context';
import { UIContext } from '../contexts/UI';
import { CargoPermissions } from '../graphql/graphql';
import HomeIcon from '@mui/icons-material/Home';
import FolderIcon from '@mui/icons-material/Folder';
import { IconButton } from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import AddIcon from '@mui/icons-material/Add';
import { FileListView } from '../components/file-list-view';
import { OrganizationContext } from '../contexts/organization.context';

const FileBreadcrumbs: FC<{ path: string}> = ({ path }) => {
  const { organization } = useContext(OrganizationContext);
  const components = path.split('/').filter((path) => path != '');

  return (
    <Breadcrumbs separator='›' aria-label="breadcrumb">
      <div style={{ alignItems: 'center', display: 'flex' }} key={0}>
        <HomeIcon />{organization?.name || ''}
      </div>
      {
        components.map((path, index) => {
          return (
            <div style={{ alignItems: 'center', display: 'flex' }} key={index + 1}>
              <FolderIcon />{path}
            </div>
          );
        })
      }
    </Breadcrumbs>
  );
}

export const Organization: FC = () => {
  const { organization } = useContext(OrganizationContext);
  const [userPermissions, setUserPermissions] = useState<any>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [folderName, setFolderName] = useState('');
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [hasCreatedFolder, setHasCreatedFolder] = useState(false);
  const [files, setFiles] = useState<any[]>([]);
  const [error, setError] = useState(null);
  const s3Client = useContext(S3Context);

  // Determine the file path to visualize
  const splat = useParams()['*'];
  const [path, setPath] = useState(`/${splat}`);

  useEffect(() => {
    setPath(`/${splat}`);
  }, [splat]);

  const handleFolderNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFolderName(event.target.value);
  };

  async function fetchS3Contents() {
    const contents = await getOrganizationContents(s3Client, organization!.bucket);
    setFiles(contents);
  }

  const handleCreateFolder = async () => {
    setIsCreatingFolder(true);
    try {
      await createFolder(s3Client, organization!.bucket, folderName);
      setHasCreatedFolder(true);
      fetchS3Contents();
    } catch (error: any) {
      setError(error);
    } finally {
      setIsCreatingFolder(false);
      setIsModalOpen(false);
    }
  };
  const permissions = useContext(PermissionsContext);

  const getPermissionsForOrganization = (bucket: string) => {
    const orgPermissions = permissions.find((permission: CargoPermissions) => permission.bucket === bucket);
    return orgPermissions;
  };

  useEffect(() => {
    if (permissions && organization) {
      const permissions = getPermissionsForOrganization(organization.bucket);
      setUserPermissions(permissions)
    }
  }, [permissions]);

  useEffect(() => {

    fetchS3Contents();

  }, [organization]);

  return (
    <Box>
      <Box sx={{ justifyContent: 'space-between', display: 'flex', alignItems: 'center', paddingBottom: 15 }}>

        <FileBreadcrumbs path={path} />

        <Box>
          <Grid container spacing={2}>
            <Grid item><TextField placeholder='Keyword' /></Grid>
            <Grid item><TextField placeholder='Property' /></Grid>
            <Grid item>
              <IconButton style={{ borderRadius: '100px', border: '1px solid #000000', padding: '12px' }}>
                <FilterListIcon />
              </IconButton>
            </Grid>
          </Grid>
        </Box>
      </Box>

      <Divider />

      <Box sx={{ justifyContent: 'space-between', display: 'flex', alignItems: 'center', paddingTop: 10 }}>
        <Typography variant='h1'>Folder Name</Typography>
        <Button variant='contained'><AddIcon />New</Button>
      </Box>

      <FileListView path={path} bucket={organization?.bucket || null}/>
    </Box>
  );

  /*
  return (
    <div>
      <Breadcrumbs separator="›" aria-label="breadcrumb">
        {
          path.map((path: any) => {
            return (
              <Link key={path.name} color="text.primary" href={path.path}>
                {path.name}
              </Link>
            )
          })
        }
      </Breadcrumbs>
      <Typography variant='h2'>{organization.name}</Typography>
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
          <FileUploader s3BucketName={location.state.bucket} loadFiles={fetchS3Contents} />
        ) : null
      }
      {
        userPermissions && (userPermissions.admin || userPermissions.read) ? (
          <S3Display s3BucketName={location.state.bucket} files={files} loadFiles={fetchS3Contents} />
        ) : null
      }
    </div>
  )
  */
}
