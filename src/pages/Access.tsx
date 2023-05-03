import { TextField, Checkbox, MenuItem, OutlinedInput, InputLabel } from '@mui/material'
import React, { useEffect, useState, useContext } from 'react'
import UserPermissionsTable from '../components/UserPermissionsTable';
import { PermissionsContext } from "../contexts/Permissions";
import { useQuery, gql } from '@apollo/client';
import Select from '@mui/material/Select';

const CARGO_GET_ALL_BUCKET_PERMISSIONS = gql`
    query CargoGetAllBucketPermissions($bucket: String!) {
      cargoGetAllBucketPermissions(bucket: $bucket) {
        _id
        user {
          id
          email
        }
        bucket
        read
        write
        delete
        admin
      }
    }
  `;

export default function Access() {
  const [userPermissions, setUserPermissions] = useState<any[]>([]);
  const [notLoadingContent, setNotLoadingContent] = useState<any>();
  const [organizationsWithAdminAccess, setOrganizationsWithAdminAccess] = useState<any[]>([]);
  const [currentOrganization, setCurrentOrganization] = useState<string>();
  const permissions = useContext(PermissionsContext);

  // set organizationsWithAdminAccess to all organizations that the user has admin access to
  const getOrganizationsWithAdminAccess = () => {
    console.log(permissions);
    const organizationsWithAdminAccess = permissions.filter((permission: any) => permission.admin);
    setOrganizationsWithAdminAccess(organizationsWithAdminAccess);
  };


  // function that returns rows of users along with checkboxes that indicate if they have read, write, or admin access using MUI Checkbox component

  const { loading, error, data } = useQuery<any>(
    CARGO_GET_ALL_BUCKET_PERMISSIONS,
    { variables: { bucket: "nist-uc-davis" } }
  );

  const handleLoading = () => {
    if (error) return <p>Error : {error.clientErrors.toString()}</p>;
  }

  useEffect(() => {
    const change = handleLoading();
    if (change) {
      setNotLoadingContent(change);
    }
    setUserPermissions(data?.cargoGetAllBucketPermissions);
  }, [data]);

  useEffect(() => {
    getOrganizationsWithAdminAccess();
    if (organizationsWithAdminAccess.length > 0) {
      console.log(organizationsWithAdminAccess);
      setCurrentOrganization(organizationsWithAdminAccess[0].bucket);
      console.log(currentOrganization);
    }
  }, [userPermissions]);

  return (
    <div>
      <h1>Manage Access</h1>
      {
        notLoadingContent ? notLoadingContent :
          (
            <>
              <TextField id="outlined-basic" label="Search Users" variant="outlined" fullWidth />
              <InputLabel id="test-select-label">Select an Organization</InputLabel>
              <Select
                style={{ marginTop: 20, marginBottom: 20, width: 300 }}
                id="demo-simple-select"
                label="Select an Organization"
                onChange={(event: any) => setCurrentOrganization(event.target.value)}
              >
                {organizationsWithAdminAccess.map((organization: any) => (
                  <MenuItem value={organization.bucket} key={organization.bucket}>{organization.bucket}</MenuItem>
                ))}
              </Select>
              <div style={{ marginTop: 20 }}>
                <UserPermissionsTable userPermissions={userPermissions} />
              </div>
            </>
          )
      }
    </div>
  )
}
