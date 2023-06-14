import { useEffect, useState, useContext, FC } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { uploadToS3, createFolder } from '../aws-client';
import { Button, TextField, Breadcrumbs, Typography, Box, Grid, Divider, AlertColor, Snackbar, Alert, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { PermissionsContext } from '../contexts/Permissions';
import { S3Context } from '../contexts/s3.context';
import { CargoPermissions } from '../graphql/graphql';
import HomeIcon from '@mui/icons-material/Home';
import FolderIcon from '@mui/icons-material/Folder';
import { OrganizationContext } from '../contexts/organization.context';
import { S3Viewer, DocViewPlugin } from '@bu-sail/s3-viewer';

export const Organization: FC = () => {
  const { organization } = useContext(OrganizationContext);
  const [_userPermissions, setUserPermissions] = useState<any>();
  const s3Client = useContext(S3Context);

  const permissions = useContext(PermissionsContext);

  const getPermissionsForOrganization = (bucket: string) => {
    const orgPermissions = permissions.find((permission: CargoPermissions) => permission.bucket === bucket);
    return orgPermissions;
  };

  useEffect(() => {
    if (permissions && organization) {
      const permissions = getPermissionsForOrganization(organization.bucket);
      setUserPermissions(permissions);
    }
  }, [permissions]);

  // TODO:
  //  * Include permissions
  //  * Handle passing the path into the s3 viewer
  return (
     <S3Viewer
      bucket={organization!.bucket}
      bucketDisplayedName={organization!.name}
      client={s3Client}
      plugins={[new DocViewPlugin()]}
    />
  );
};
