import { useEffect, useState, useContext, FC } from 'react';
import { PermissionsContext } from '../contexts/Permissions';
import { S3Context } from '../contexts/s3.context';
import { CargoPermissions } from '../graphql/graphql';
import { OrganizationContext } from '../contexts/organization.context';
import { S3Viewer, DocViewPlugin } from '@bu-sail/s3-viewer';
import { useParams, useNavigate } from 'react-router-dom';
import { CargoPresignDocument } from '../graphql/sign/sign';
import { useApolloClient } from '@apollo/client';
import { SeqVizPlugin } from '../components/SequenceViz';
import { RcsbMolstarPlugin } from '../components/RcsbMolstar';
import { JupyterNotebookPlugin } from '../components/JupyterNotebook';
import { FileCommentPlugin } from '../components/FileComment';

export const Organization: FC = () => {
  const { organization } = useContext(OrganizationContext);
  const [userPermissions, setUserPermissions] = useState<CargoPermissions | null>(null);
  const s3Client = useContext(S3Context);

  // Make the getSignedUrl function for the s3 viewer to use that leverages
  // Cargo. Cannot use React hooks so the Apollo Client is used directly
  const apolloClient = useApolloClient();
  const getSignedUrl = async (bucket: string, key: string, expires: number): Promise<string> => {
    const query = await apolloClient.query({
      query: CargoPresignDocument,
      variables: { presignRequest: { bucket, key, expires } }
    });

    return query.data.cargoPresign;
  };

  const permissions = useContext(PermissionsContext);

  const getPermissionsForOrganization = (bucket: string) => {
    const orgPermissions = permissions.find((permission: CargoPermissions) => permission.bucket === bucket);
    return orgPermissions;
  };

  // Handle getting the user permissions for the organization
  useEffect(() => {
    if (permissions && organization) {
      const permissions = getPermissionsForOrganization(organization.bucket);
      setUserPermissions(permissions || null);
    }
  }, [permissions]);

  // Provides controls for the path based on the user navigation
  const [currentPath, setCurrentPath] = useState<string>('');

  // Base the path on the splat
  const splat = useParams()['*'];

  useEffect(() => {
    setCurrentPath(`${splat}`);
  }, [splat]);

  // Update the URI to match the redirect
  const navigate = useNavigate();
  useEffect(() => {
    navigate(`/organization/${currentPath}`);
  }, [currentPath]);

  return (
    <>
      {organization && userPermissions && (
        <S3Viewer
          bucket={organization!.bucket}
          bucketDisplayedName={organization!.name}
          client={s3Client}
          getSignedUrl={getSignedUrl}
          pathControl={{ currentPath, setCurrentPath }}
          plugins={[new DocViewPlugin(), new SeqVizPlugin(), new RcsbMolstarPlugin(), new JupyterNotebookPlugin(), new FileCommentPlugin()]}
          sideNavTopPadding="64px"
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
