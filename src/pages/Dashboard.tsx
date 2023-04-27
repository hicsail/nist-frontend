import React, { useState, useContext } from 'react'
import { useQuery, gql } from '@apollo/client';
import { Button, IconButton, Paper, Typography } from '@mui/material';
import FolderOpenOutlinedIcon from '@mui/icons-material/FolderOpenOutlined';
import { getOrganizationContents } from '../aws-client';
import { useNavigate } from 'react-router-dom';
import { PermissionsContext } from '../contexts/Permissions';

interface Organization {
    _id: string
    name: string;
    bucket: string;
}
export default function Dashboard() {

    const [organizations, setOrganizations] = useState([]);
    const [adminOrganizations, setAdminOrganizations] = useState<any>([]);
    const [accessOrganizations, setAccessOrganizations] = useState<any>([]);
    const [noAccessOrganizations, setNoAccessOrganizations] = useState<any>([]);
    const navigate = useNavigate();
    const permissions = useContext(PermissionsContext);
    const GET_ORGANIZATIONS = gql`
        query GetOrganizations {
            getOriganizations {
                _id
                name 
                bucket
            }
        }
    `;

    // function that takes in a list of organizations and returns a list of JSX elements with folder icon and organization name
    const renderOrganizations = (organizations: any, canClick: boolean) => {
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

    const filterOrgsByPermission = (organizations: any, permission: string) => {
        let orgs: any[] = [];
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

    useQuery(GET_ORGANIZATIONS, {
        onCompleted: (data) => {
            setOrganizations(data.getOriganizations);
            setAdminOrganizations(filterOrgsByPermission(data.getOriganizations, 'admin'));
            setAccessOrganizations(filterOrgsByPermission(data.getOriganizations, 'access'));
            setNoAccessOrganizations(filterOrgsByPermission(data.getOriganizations, 'noAccess'));
        },
        onError: (error) => {
            console.log(error);
        }
    });

    const routeToOrganization = (organization: Organization) => {
        // route to path /organization/:orgId and pass organization as props
        navigate(`/organization/${organization._id}`, { state: organization });
    }


    return (
        <div>
            <h1>Institutions</h1>
            <h4>My Organizations</h4>
            <div style={{ display: 'flex' }}>
                {renderOrganizations(adminOrganizations, true)}
            </div>
            <h4>Organizations with Access</h4>
            <div style={{ display: 'flex' }}>
                {renderOrganizations(accessOrganizations, true)}
            </div>
            <h4>All Organizations</h4>
            <div style={{ display: 'flex' }}>
                {renderOrganizations(noAccessOrganizations, false)}
            </div>
        </div>
    )
}
