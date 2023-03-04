import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import { getOrganizationContents } from '../aws-client';
import BiologyLabFilesTable from '../components/FileViewer';

export default function Organization(props: any) {
    const location = useLocation();
    const [organizationContents, setOrganizationContents] = useState<any>([]);
    const organization = location.state;

    const labFiles = [
        {
          id: 1,
          name: 'Lab Report 1',
          description: 'Report on the first biology lab',
          createdAt: '2022-01-01T12:00:00.000Z',
          updatedAt: '2022-01-02T10:00:00.000Z',
          s3Bucket: 'biology-labs',
          s3Key: 'lab-reports/lab-report-1.pdf',
          fileSize: 152000,
          fileUrl: 'https://s3.amazonaws.com/biology-labs/lab-reports/lab-report-1.pdf'
        },
        {
          id: 2,
          name: 'Lab Report 2',
          description: 'Report on the second biology lab',
          createdAt: '2022-01-05T14:00:00.000Z',
          updatedAt: '2022-01-06T15:00:00.000Z',
          s3Bucket: 'biology-labs',
          s3Key: 'lab-reports/lab-report-2.pdf',
          fileSize: 205000,
          fileUrl: 'https://s3.amazonaws.com/biology-labs/lab-reports/lab-report-2.pdf'
        },
        {
          id: 3,
          name: 'Lab Report 3',
          description: 'Report on the third biology lab',
          createdAt: '2022-01-10T09:00:00.000Z',
          updatedAt: '2022-01-11T11:00:00.000Z',
          s3Bucket: 'biology-labs',
          s3Key: 'lab-reports/lab-report-3.pdf',
          fileSize: 183000,
          fileUrl: 'https://s3.amazonaws.com/biology-labs/lab-reports/lab-report-3.pdf'
        },
        // Add more lab files as needed
      ];
      

    useEffect(() => {
        setOrganizationContents(getOrganizationContents(location.state.bucket));
    }, [location.state.bucket]);
    
    return (
        <div>
            <h2>{organization.name}</h2>
            <div>
                <BiologyLabFilesTable labFiles={labFiles} />
            </div>
        </div>
    )
}
