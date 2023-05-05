import {
  Paper,
  TableContainer,
  TableHead,
  TableCell,
  TableRow,
  Table,
  TableBody,
  Button,
  IconButton,
  AlertColor
} from '@mui/material';
import { FC, useContext, useState, useEffect, ReactNode, Dispatch, SetStateAction } from 'react';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import DeleteIcon from '@mui/icons-material/Delete';
import FolderIcon from '@mui/icons-material/Folder';
import { S3Context } from '../contexts/s3.context';
import { ListObjectsCommand, S3Client, _Object as S3Object } from '@aws-sdk/client-s3';
import { useLocation, useNavigate } from 'react-router-dom';
import { deleteFile, downloadFile } from '../aws-client';
import { OrganizationContext } from '../contexts/organization.context';

// TODO: Handle when there are more then 1000 objects
const getObjectsForPath = async (s3Client: S3Client, bucket: string, path: string): Promise<S3Object[]> => {
  // Get the files that match the given prefix
  const result = await s3Client.send(new ListObjectsCommand({ Bucket: bucket, Prefix: path }));
  if (!result.Contents) { return []; }
  let objects = result.Contents;

  // Filter out files that are not in the current "folder"
  return objects.filter((object) => {
    const key = object.Key;
    if (!key) {
      return false;
    }

    // Don't include the path itself
    if (key == path || path == `/${key}`) {
      return false;
    }

    // Trim off the path from the begining of the key, then check to see
    // if the object represents a folder or a file at the top level
    const pathRemainder = key.substring(path.length).split('/');
    return pathRemainder.length == 1 || (pathRemainder.length == 2 && pathRemainder[1] == '');
  });
}

const formatBytes = (size: number | undefined): string => {
  if (!size || size == 0) {
    return '-';
  }

  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let n = 0;
  while (size >= 1024 && n < units.length - 1) {
    size /= 1024;
    n++;
  }
  return `${size.toFixed(2)} ${units[n]}`;
};

interface FileRowProps {
  object: S3Object;
  setShouldReload: Dispatch<SetStateAction<boolean>>;
  setSnackBarSettings: Dispatch<SetStateAction<{ message: string, open: boolean, severity: AlertColor }>>;
}

const FileRowView: FC<FileRowProps> = ({ object, setShouldReload, setSnackBarSettings }) => {
  const fileComponents = object.Key!.split('/');
  const isFolder = fileComponents[fileComponents.length - 1] == '';
  const navigate = useNavigate();
  const location = useLocation();
  const s3Client = useContext(S3Context);
  const { organization } = useContext(OrganizationContext);
  // Get the name which is the last element in the path split on '/' or the
  // second to last in the case of a folder
  const name = fileComponents[isFolder ? fileComponents.length - 2 : fileComponents.length - 1];

  // Determine if the view of the file should just be the name or the
  // folder view
  let fileNameView: ReactNode = name;
  if (isFolder) {
    fileNameView = (
      <Button variant='text'
        onClick={() => navigate(`${location.pathname}${name}/`)}
        style={{
          alignItems: 'center',
          display: 'flex',
          color: 'black',
          outline: 'none'
        }}>
        <FolderIcon style={{ marginRight: 3 }} />
        {name}
      </Button>
    );
  }

  // Delete the file and open a snackbar to display the result
  const deleteFileHandler = async () => {
    const deleteResult = await deleteFile(s3Client, organization!.bucket, object.Key!);
    const snackBarSettings = { message: 'File deleted successfully', open: true, severity: 'success' as AlertColor };
    if (!deleteResult) {
      snackBarSettings.message = 'Failed to delete file';
      snackBarSettings.severity = 'error';
    }

    setShouldReload(true);
    setSnackBarSettings(snackBarSettings);
  };

  let operations = (
    <div>
      <IconButton onClick={() => downloadFile(s3Client, organization!.bucket, object.Key!)}>
        <FileDownloadIcon />
      </IconButton>
      <IconButton onClick={deleteFileHandler}>
        <DeleteIcon />
      </IconButton>
    </div>
  );
  if (isFolder) {
    operations = <></>;
  }

  return (
    <TableRow key={name}>
      <TableCell>
        {fileNameView}
      </TableCell>
      <TableCell>{object.LastModified ? object.LastModified.toLocaleDateString() : ''}</TableCell>
      <TableCell>{formatBytes(object.Size)}</TableCell>
      <TableCell>{operations}</TableCell>
    </TableRow>
  );
};

export interface FileListViewProps {
  path: string;
  bucket: string | null;
  setSnackBarSettings: Dispatch<SetStateAction<{ message: string, open: boolean, severity: AlertColor }>>;
  shouldReload: boolean,
  setShouldReload: Dispatch<SetStateAction<boolean>>;
}

export const FileListView: FC<FileListViewProps> = (props) => {
  const s3Client = useContext(S3Context);
  const [objects, setObjects] = useState<S3Object[]>([]);

  const loadFiles = async () => {
    const objs = await getObjectsForPath(s3Client, props.bucket!, props.path);
    setObjects(objs);
  };


  // TODO: Condense these two use effects into one. Currently exists so
  // loading on path change is independent of manual reloading (such as new
  // file being uploaded)
  useEffect(() => {
    if (props.shouldReload && props.bucket) {
      loadFiles();
      props.setShouldReload(false);
    }
  }, [props.bucket, props.shouldReload]);

  useEffect(() => {
    if (props.bucket) {
      loadFiles();
    }
  }, [props.bucket, props.path]);

  return (
    <TableContainer component={Paper} sx={{ minWidth: 650 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Created Date</TableCell>
            <TableCell>Size</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {objects.map((object) =>
            <FileRowView object={object} setShouldReload={props.setShouldReload} setSnackBarSettings={props.setSnackBarSettings} />)
          }
        </TableBody>
      </Table>
    </TableContainer>
  );
}
