import { FC, useContext, useEffect, useState } from 'react';
import { Organization } from '../graphql/graphql';
import { DocViewPlugin, S3Viewer } from '@bu-sail/s3-viewer';
import { S3Context } from '../contexts/s3.context';
import { useApolloClient } from '@apollo/client';
import { CargoPresignDocument } from '../graphql/sign/sign';
import { PermissionsContext } from '../contexts/Permissions';
import { CargoPermissions } from '../graphql/graphql';

interface ProtocolViewProps {
  organization: Organization;
}

export const ProtocolView: FC<ProtocolViewProps> = ({ organization }) => {
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

  const allPermissions = useContext(PermissionsContext);
  const [permissions, setPermissions] = useState<CargoPermissions | null>(null);

  useEffect(() => {
    if (allPermissions) {
      setPermissions(allPermissions.find((perm) => perm.bucket == organization.bucket) || null);
    }
  }, [allPermissions]);

  return (
    <>
      {permissions && (
        <S3Viewer
          bucket={organization.protocolBucket}
          bucketDisplayedName={`${organization.name} Protocols`}
          client={s3Client}
          getSignedUrl={getSignedUrl}
          disableCreateFolder={true}
          disableWrite={!permissions.write}
          disableUpload={!permissions.write}
          disableRename={!permissions.write}
          disableDelete={!permissions.delete}
          plugins={[new DocViewPlugin()]}
        />
      )}
    </>
  );
}
