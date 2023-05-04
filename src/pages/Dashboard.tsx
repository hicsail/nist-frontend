import { useState, useContext, useEffect } from 'react'
import { IconButton, Typography } from '@mui/material';
import FolderOpenOutlinedIcon from '@mui/icons-material/FolderOpenOutlined';
import { useNavigate } from 'react-router-dom';
import { PermissionsContext } from '../contexts/Permissions';
import { UIContext } from '../contexts/UI';
import { useGetOrganizationsQuery } from '../graphql/organization/organization';
import { Organization } from '../graphql/graphql';

export default function Dashboard() {

    const [adminOrganizations, setAdminOrganizations] = useState<any>([]);
    const [accessOrganizations, setAccessOrganizations] = useState<any>([]);
    const [noAccessOrganizations, setNoAccessOrganizations] = useState<any>([]);
    const navigate = useNavigate();
    const permissions = useContext(PermissionsContext);
    const { path, setPath } = useContext(UIContext);

    // function that takes in a list of organizations and returns a list of JSX elements with folder icon and organization name
    const renderOrganizations = (organizations: Organization[], canClick: boolean) => {
        return organizations.map((organization: Organization) => (
            <div key={organization.name}>
                <div>
                    <IconButton aria-label="delete" size="large" onClick={() => canClick ? routeToOrganization(organization) : alert("Contact Administrator for Org to request Access")}>
                        <FolderOpenOutlinedIcon fontSize='large' />
                        {organization.name}
                    </IconButton>
                </div>
            </div>
        ))
    }

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
                if (orgPermission && orgPermission.read && !orgPermission.admin) {
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
    }

    // Get and populate the organization information
    const orgQuery = useGetOrganizationsQuery();
    useEffect(() => {
        if (orgQuery.data) {
            const organizations = orgQuery.data.getOriganizations;
            setAdminOrganizations(filterOrgsByPermission(organizations, 'admin'));
            setAccessOrganizations(filterOrgsByPermission(organizations, 'access'));
            setNoAccessOrganizations(filterOrgsByPermission(organizations, 'noAccess'));
        }
        if (orgQuery.error) {
            console.error(orgQuery.error);
        }
    }, [orgQuery.data, orgQuery.error, permissions]);

    const routeToOrganization = (organization: Organization) => {
        // route to path /organization/:orgId and pass organization as props
        navigate(`/organization/${organization._id}`, { state: organization });
    }

    useEffect(() => {
        // if set path has been added to global context from app
        if (path) {
            // if the path is not the same as the current path
            // set the path to the current path
            setPath([{ name: 'Dashboard', path: '/dashboard' }]);
        }
    }, []);

    const categoryBlockStyle = {
        margin: '10px',
        padding: '10px',
    };

    return (
        <div>
            <Typography variant='h1'>Institutions</Typography>
            <div style={categoryBlockStyle}>
                <Typography variant='h3'>My Organizations</Typography>
                <div style={{ display: 'flex' }}>
                    {renderOrganizations(adminOrganizations, true)}
                </div>
            </div>
            <div style={categoryBlockStyle}>
                <Typography variant='h3'>Organizations with Access</Typography>
                <div style={{ display: 'flex' }}>
                    {renderOrganizations(accessOrganizations, true)}
                </div>
            </div>
            <div style={categoryBlockStyle}>
                <Typography variant='h3'>All Organizations</Typography>
                <div style={{ display: 'flex' }}>
                    {renderOrganizations(noAccessOrganizations, false)}
                </div>
            </div>
        </div>
    )
}
