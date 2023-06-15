import { useEffect, useState, useContext, FC } from 'react';
import { PermissionsContext } from '../contexts/Permissions';
import { S3Context } from '../contexts/s3.context';
import { CargoPermissions } from '../graphql/graphql';
import { OrganizationContext } from '../contexts/organization.context';
import { S3Viewer, DocViewPlugin } from '@bu-sail/s3-viewer';

export const Organization: FC = () => {
  const { organization } = useContext(OrganizationContext);
  const [userPermissions, setUserPermissions] = useState<CargoPermissions | null>(null);
  const s3Client = useContext(S3Context);

  const permissions = useContext(PermissionsContext);

  const getPermissionsForOrganization = (bucket: string) => {
    const orgPermissions = permissions.find((permission: CargoPermissions) => permission.bucket === bucket);
    return orgPermissions;
  };

  useEffect(() => {
    if (permissions && organization) {
      const permissions = getPermissionsForOrganization(organization.bucket);
      setUserPermissions(permissions || null);
    }
  }, [permissions]);

  // TODO:
  //  * Allow navigation changes (going back/forward) to change the path of
  //    the S3Viewer
  return (
    <>
     {organization && userPermissions && (
      <S3Viewer
        bucket={organization!.bucket}
        bucketDisplayedName={organization!.name}
        client={s3Client}
        plugins={[new DocViewPlugin()]}
        disableRead={!userPermissions.read}
        disableWrite={!userPermissions.write}
        disableUpload={!userPermissions.write}
        disablePreview={!userPermissions.read}
        disableDelete={!userPermissions.delete}
        disableDownload={!userPermissions.read}
        disableRename={!userPermissions.write}
        disableCreateFolder={!userPermissions.write}
      />
      )}
    </>
  );
};
