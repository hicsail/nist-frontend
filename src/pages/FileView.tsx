import { useState, useContext, useEffect, FC } from 'react';
import { Typography } from '@mui/material';
import { PermissionsContext } from '../contexts/Permissions';
import { UIContext } from '../contexts/UI';
import { Organization } from '../graphql/graphql';
import { OrganizationCard } from '../components/OrganizationCard';
import { OrganizationContext } from '../contexts/organization.context';

export const FileView: FC = () => {
  const [adminOrganizations, setAdminOrganizations] = useState<any>([]);
  const [accessOrganizations, setAccessOrganizations] = useState<any>([]);
  const [noAccessOrganizations, setNoAccessOrganizations] = useState<any>([]);
  const permissions = useContext(PermissionsContext);
  const { path, setPath } = useContext(UIContext);

  // function that takes in a list of organizations and returns a list of JSX elements with folder icon and organization name along with a placeholder icon to mark as favorite
  const renderOrganizations = (organizations: Organization[], canClick: boolean, accessType: string) => {
    // card for each organization that show cases organization name and thumbnail image
    return organizations.map((organization: Organization) => (
      <div key={organization._id}>
        <OrganizationCard organization={organization} canClick={canClick} accessType={accessType} />
      </div>
    ));
  };

  const filterOrgsByPermission = (organizations: Organization[], permission: string) => {
    let orgs: Organization[] = [];
    organizations.forEach((organization: Organization) => {
      if (permission === 'admin') {
        // get permission for org from permissions
        const orgPermission = permissions.find((orgPermission: any) => orgPermission.bucket === organization.bucket);
        if (orgPermission && orgPermission.admin) {
          orgs.push(organization);
        }
      }
      if (permission === 'access') {
        // get permission for org from permissions
        const orgPermission = permissions.find((orgPermission: any) => orgPermission.bucket === organization.bucket);
        if (orgPermission && (orgPermission.read || orgPermission.write || orgPermission.delete) && !orgPermission.admin) {
          orgs.push(organization);
        }
      }
      if (permission === 'noAccess') {
        // get permission for org from permissions
        const orgPermission = permissions.find((orgPermission: any) => orgPermission.bucket === organization.bucket);
        if (orgPermission && !orgPermission.read && !orgPermission.admin && !orgPermission.write && !orgPermission.delete) {
          orgs.push(organization);
        }
      }
    });

    return orgs;
  };

  // Get and populate the organization information
  const { organizations } = useContext(OrganizationContext);
  useEffect(() => {
    setAdminOrganizations(filterOrgsByPermission(organizations, 'admin'));
    setAccessOrganizations(filterOrgsByPermission(organizations, 'access'));
    setNoAccessOrganizations(filterOrgsByPermission(organizations, 'noAccess'));
  }, [organizations, permissions]);

  useEffect(() => {
    // if set path has been added to global context from app
    if (path) {
      // if the path is not the same as the current path
      // set the path to the current path
      setPath([{ name: 'Dashboard', path: '/dashboard' }]);
    }
  }, []);

  return (
    <div>
      <Typography variant="h1" style={{ marginBottom: 20 }}>
        Institution Folders
      </Typography>
      {adminOrganizations.length > 0 && (
        <>
          <div style={{ marginTop: 20, marginBottom: 20 }}>
            <Typography variant="h3">My Organizations</Typography>
            <div style={{ display: 'flex', marginTop: 10 }}>{renderOrganizations(adminOrganizations, true, 'Admin')}</div>
          </div>
        </>
      )}
      {accessOrganizations.length > 0 && (
        <>
          <div style={{ marginTop: 20, marginBottom: 20 }}>
            <Typography variant="h3">Organizations with Access</Typography>
            <div style={{ display: 'flex', marginTop: 10 }}>{renderOrganizations(accessOrganizations, true, 'Can View')}</div>
          </div>
        </>
      )}
      {noAccessOrganizations.length > 0 && (
        <>
          <div style={{ marginTop: 20, marginBottom: 20 }}>
            <Typography variant="h3">All Organizations</Typography>
            <div style={{ display: 'flex', marginTop: 10 }}>{renderOrganizations(noAccessOrganizations, false, 'No Access')}</div>
          </div>
        </>
      )}
    </div>
  );
}
