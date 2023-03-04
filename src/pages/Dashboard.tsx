import React, { useState } from 'react'
import { useQuery, gql } from '@apollo/client';
import { Button, IconButton } from '@mui/material';
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

    // function that takes in a list of organizations and returns a list of JSX elements with folder icon and organization name
    const renderOrganizations = (organizations: any) => {
        return organizations.map((organization: Organization) => (
            <div key={organization.name}>
                <IconButton aria-label="delete" size="large" onClick={()=>routeToOrganization(organization)}>
                    <FolderOpenOutlinedIcon />
                    {organization.name}
                </IconButton>
            </div>
        ))
    }

    const routeToOrganization = (organization: Organization) => {
        // route to path /organization/:orgId and pass organization as props
        navigate(`/organization/${organization._id}`, {state: organization});
    }


    return (
        <div>
            <h1>Dashboard</h1>
            <div style={{display: 'flex'}}>
                {renderOrganizations(organizations)}
            </div>
        </div>
    )
}
