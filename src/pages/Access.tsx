import { TextField, Checkbox } from '@mui/material'
import React from 'react'
import UserPermissionsTable from '../components/UserPermissionsTable';
import { useQuery, gql } from '@apollo/client';

type CargoPermission = {
    _id: string;
    user: string;
    bucket: string;
    read: boolean;
    write: boolean;
    delete: boolean;
    admin: boolean;
  }
  
  type CargoGetAllBucketPermissionsResult = {
    cargoGetAllBucketPermissions: CargoPermission[];
  }
  
  const CARGO_GET_ALL_BUCKET_PERMISSIONS = gql`
    query CargoGetAllBucketPermissions($bucket: String!) {
      cargoGetAllBucketPermissions(bucket: $bucket) {
        _id
        user
        bucket
        read
        write
        delete
        admin
      }
    }
  `;

export default function Access() {

    const userData: any = [
        { id: 1, name: 'Alice', read: true, write: true, delete: false, admin: false },
        { id: 2, name: 'Bob', read: true, write: false, delete: false, admin: false },
        { id: 3, name: 'Charlie', read: true, write: true, delete: true, admin: false },
        { id: 4, name: 'Dave', read: true, write: true, delete: true, admin: false },
        { id: 5, name: 'Eve', read: true, write: true, delete: true, admin: true },
        { id: 6, name: 'Frank', read: true, write: false, delete: false, admin: false },
        { id: 7, name: 'Grace', read: true, write: true, delete: true, admin: true },
        { id: 8, name: 'Heidi', read: true, write: false, delete: false, admin: false },
        { id: 9, name: 'Ivan', read: true, write: true, delete: false, admin: false },
        { id: 10, name: 'Jack', read: true, write: true, delete: true, admin: true },
        { id: 11, name: 'Kate', read: true, write: false, delete: false, admin: false },
        { id: 12, name: 'Liam', read: true, write: true, delete: false, admin: false },
        { id: 13, name: 'Mia', read: true, write: true, delete: true, admin: false },
        { id: 14, name: 'Nick', read: true, write: true, delete: false, admin: false },
        { id: 15, name: 'Olivia', read: true, write: false, delete: false, admin: false }
      ];
      

    // function that returns rows of users along with checkboxes that indicate if they have read, write, or admin access using MUI Checkbox component
    
    const { loading, error, data } = useQuery<CargoGetAllBucketPermissionsResult>(
        CARGO_GET_ALL_BUCKET_PERMISSIONS,
        { variables: { bucket: "nist-ucdavis-dev"  } }
    );

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :</p>;
    console.log(data);

    
    return (
        <div>
            <h1>Manage Access</h1>
            <TextField id="outlined-basic" label="Search Users" variant="outlined" fullWidth />
            <div style={{marginTop: 20}}>
                <UserPermissionsTable users={userData} />
            </div>
        </div>
    )
}
