import { useEffect, useState, useContext, FC } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { getOrganizationContents } from '../aws-client';
import {
  Button,
  TextField,
  Breadcrumbs,
  Typography,
  Box,
  Grid,
  Divider,
  AlertColor,
  Snackbar,
  Alert
} from '@mui/material';
import { PermissionsContext } from "../contexts/Permissions";
import { S3Context } from '../contexts/s3.context';
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
  const buttonStyle = {
    alignItems: 'center',
    display: 'flex',
    color: 'black',
    outline: 'none'
  }
  const navigate = useNavigate();

  return (
    <Breadcrumbs separator='›' aria-label="breadcrumb">
      <Button variant='text' style={buttonStyle} key={0} onClick={() => navigate('/organization/')}>
        <HomeIcon />{organization?.name || ''}
      </Button>
      {
        components.map((path, index) => {
          return (
            <Button variant='text' style={buttonStyle} key={index + 1} onClick={() => {
              const fullPath = `/organization/${components.splice(0, index + 1).join('/')}/`;
              navigate(fullPath);
            }}>
              <FolderIcon />{path}
            </Button>
          );
        })
      }
    </Breadcrumbs>
  );
}

export const Organization: FC = () => {
  const { organization } = useContext(OrganizationContext);
  const [_userPermissions, setUserPermissions] = useState<any>();
  const [_files, setFiles] = useState<any[]>([]);
  const s3Client = useContext(S3Context);
  const [snackBarSettings, setSnackBarSettings] = useState<{ message: string, open: boolean, severity: AlertColor}>({
    message: '',
    open: false,
    severity: 'success'
  });

  // Determine the file path to visualize
  const splat = useParams()['*'];
  const [path, setPath] = useState(`/${splat}`);

  useEffect(() => {
    setPath(`/${splat}`);
  }, [splat]);

  async function fetchS3Contents() {
    const contents = await getOrganizationContents(s3Client, organization!.bucket);
    setFiles(contents);
  }

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
        <Box>
          <Grid container spacing={2}>
            <Grid item>
              <Button variant='contained'><AddIcon />Upload File</Button>
            </Grid>
            <Grid item>
              <Button variant='contained'><FolderIcon />New Folder</Button>
            </Grid>
          </Grid>
        </Box>
      </Box>

      <FileListView path={path} bucket={organization?.bucket || null} setSnackBarSettings={setSnackBarSettings}/>
      <Snackbar
        open={snackBarSettings.open}
        autoHideDuration={6000}
        onClose={() => setSnackBarSettings({ message: '', open: false, severity: 'success' })}
      >
        <Alert severity={snackBarSettings.severity} sx={{ width: '100%' }}>
          {snackBarSettings.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
