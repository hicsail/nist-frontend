import { FC, useContext, useState, SyntheticEvent } from 'react';
import { Autocomplete, TextField, Grid } from '@mui/material';
import { S3Context } from '../contexts/s3.context';
import { getOrganizationContents } from '../aws-client';
import { OrganizationContext } from '../contexts/organization.context';
import { useNavigate } from 'react-router-dom';
import FolderIcon from '@mui/icons-material/Folder';

type FileOptions = {
  label: string,
  id: string
};

export const FileOption: FC<{ option: FileOptions }> = (props) => {
  // TODO: By introducing the concept of a file type can reduce some of this
  // duplicated logic for determining if the object is a folder
  const fileComponents = props.option.id.split('/');
  const isFolder = fileComponents[fileComponents.length - 1] == '';


  return (
    <Grid container key={props.option.id}>
      <Grid item xs={2}>
        {isFolder ? <FolderIcon /> : <></>}
      </Grid>
      <Grid item xs={2}>
        {props.option.label}
      </Grid>
    </Grid>
  );
};

export const FileSearch: FC = () => {
  const s3Client = useContext(S3Context);
  const { organization } = useContext(OrganizationContext);
  const [options, setOptions] = useState<FileOptions[]>([]);
  const [value, setValue] = useState<FileOptions | null>(null);
  const navigate = useNavigate();

  // Get all objects from S3 and represent them as options the user can
  // select from
  const loadOptions = async () => {
    // Clear out the current value
    setValue(null);

    const objects = await getOrganizationContents(s3Client, organization!.bucket);

    const options = objects.map((obj) => {
      const fileComponents = obj.Key.split('/');
      const isFolder = fileComponents[fileComponents.length - 1] == '';
      const name = fileComponents[isFolder ? fileComponents.length - 2 : fileComponents.length - 1];

      return { label: name, id: obj.Key };
    });

    // Set the options the user can search for based on the files
    setOptions(options);
  };


  // Get the selection and navigate to the top level folder
  const handleSelection = (_event: SyntheticEvent<Element, Event>, value: { label: string, id: string } | null) => {
    if (!value) {
      return;
    }
    setValue(value);

    const fileComponents = value.id.split('/');
    const isFolder = fileComponents[fileComponents.length - 1] == '';

    const path = fileComponents.slice(0, isFolder ? fileComponents.length - 2 : fileComponents.length - 1).join('/');

    if (path == '') {
      navigate('/organization');
    } else {
      navigate(`/organization/${path}/`);
    }
  };

  return (
    <Autocomplete
      onFocus={loadOptions}
      onChange={handleSelection}
      value={value}
      options={options}
      sx={{ width: 300 }}
      renderInput={(params) => <TextField {...params} label="File" />}
      renderOption={(props, option) => <li {...props}><FileOption key={option.id} option={option} /></li>}
    />
  );
};
