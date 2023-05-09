import { FC, useContext, useState } from 'react';
import { Autocomplete, TextField } from '@mui/material';
import { S3Context } from '../contexts/s3.context';
import { getOrganizationContents } from '../aws-client';
import { OrganizationContext } from '../contexts/organization.context';

export const FileSearch: FC = () => {
  const s3Client = useContext(S3Context);
  const { organization } = useContext(OrganizationContext);
  const [options, setOptions] = useState<{ label: string, id: string }[]>([]);

  const loadOptions = async () => {
    const objects = await getOrganizationContents(s3Client, organization!.bucket);

    // Set the options the user can search for based on the files
    setOptions(objects.map((obj) => {
      const fileComponents = obj.Key.split('/');
      const isFolder = fileComponents[fileComponents.length - 1] == '';
      const name = fileComponents[isFolder ? fileComponents.length - 2 : fileComponents.length - 1];

      return { label: name, id: obj.Key };
    }));
  };

  return (
    <Autocomplete
      onFocus={loadOptions}
      options={options}
      sx={{ width: 300 }}
      renderInput={(params) => <TextField {...params} label="File" />}
    />
  );
};
