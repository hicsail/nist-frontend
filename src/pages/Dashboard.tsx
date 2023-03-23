import React, { useState } from 'react'
import { useQuery, gql } from '@apollo/client';
import { Button, IconButton, Paper, Typography } from '@mui/material';
import FolderOpenOutlinedIcon from '@mui/icons-material/FolderOpenOutlined';
import { getOrganizationContents } from '../aws-client';
import { useNavigate } from 'react-router-dom';


export default function Dashboard() {

    const [organizations, setOrganizations] = useState([]);
    const navigate = useNavigate();

    const GET_ORGANIZATIONS = gql`
        query GetOrganizations {
            getOriganizations {
                _id
                name 
                bucket
            }
        }
    `;

    useQuery(GET_ORGANIZATIONS, {
        onCompleted: (data) => {
            console.log(data);
            setOrganizations(data.getOriganizations);
        },
        onError: (error) => {
            console.log(error);
        }
    });

    interface Organization {
        _id: string
        name: string;
        bucket: string;
    }

    interface Permissions {
        _id: string;
        user: string;
        bucket: string;
        read: boolean;
        write: boolean;
        delete: boolean;
        admin: boolean;
    }

    const permissions: Permissions[] = [{
        _id: "1",
        user: "user123",
        bucket: "nist-ucdavis-dev",
        read: true,
        write: false,
        delete: true,
        admin: true,
    }, {
        _id: "1",
        user: "user123",
        bucket: "nist-dev",
        read: true,
        write: false,
        delete: true,
        admin: false,
    }];

    // function that takes in a list of organizations and returns a list of JSX elements with folder icon and organization name
    const renderOrganizations = (organizations: any, canClick: boolean) => {
        return organizations.map((organization: Organization) => (
            <div key={organization.name}>
                <div>
                    <IconButton aria-label="delete" size="large" onClick={() => canClick ? routeToOrganization(organization): alert("Contact Administrator for Org to request Access")}>
                        <FolderOpenOutlinedIcon fontSize='large' />
                        {organization.name}
                    </IconButton>
                </div>
            </div>
        ))
    }

    const filterOrgsByPermission = (organizations: any, permission: string) => {

        // filter organizations based on permission admin || read || write || delete
        let orgs = [];
        if (permission === 'admin') {
            orgs = organizations.filter((organization: Organization) => {
                return permissions.some((permission: Permissions) => permission.admin && permission.bucket === organization.bucket);
            });
        }

        if (permission === 'access') {
            orgs = organizations.filter((organization: Organization) => {
                return permissions.some((permission: Permissions) => (permission.read || permission.write || permission.delete) && permission.bucket === organization.bucket);
            });
        }
        return orgs;
    }
    const routeToOrganization = (organization: Organization) => {
        // route to path /organization/:orgId and pass organization as props
        navigate(`/organization/${organization._id}`, { state: organization });
    }


    return (
        <div>
            <h1>Institutions</h1>
            <h4>My Organizations</h4>
            <div style={{ display: 'flex' }}>
                {renderOrganizations(filterOrgsByPermission(organizations, 'admin'), true)}
            </div>
            <h4>Organizations with Access</h4>
            <div style={{ display: 'flex' }}>
                {renderOrganizations(filterOrgsByPermission(organizations, 'access'), true)}
            </div>
            <h4>All Organizations</h4>
            <div style={{ display: 'flex' }}>
                {renderOrganizations(organizations, false)}
            </div>
        </div>
    )
}
