import {
  Paper,
  TableContainer,
  TableHead,
  TableCell,
  TableRow,
  Table,
  Typography,
  Button
} from '@mui/material';
import { FC, useContext, useState, useEffect, ReactNode, Dispatch, SetStateAction } from 'react';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import DeleteIcon from '@mui/icons-material/Delete';
import FolderIcon from '@mui/icons-material/Folder';
import { S3Context } from '../contexts/s3.context';
import { ListObjectsCommand, PutObjectCommand, S3Client, _Object as S3Object } from '@aws-sdk/client-s3';
import { useLocation } from 'react-router-dom';

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
  setPath: Dispatch<SetStateAction<string>>;
}

const FileRowView: FC<FileRowProps> = ({ object, setPath }) => {
  const fileComponents = object.Key!.split('/');
  const isFolder = fileComponents[fileComponents.length - 1] == '';

  // Get the name which is the last element in the path split on '/' or the
  // second to last in the case of a folder
  const name = fileComponents[isFolder ? fileComponents.length - 2 : fileComponents.length - 1];

  // Determine if the view of the file should just be the name or the
  // folder view
  let fileNameView: ReactNode = name;
  if (isFolder) {
    fileNameView = (
      <Button variant='text'
        onClick={() => setPath(object.Key!)}
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

  return (
    <TableRow>
      <TableCell>
        {fileNameView}
      </TableCell>
      <TableCell>{object.LastModified ? object.LastModified.toLocaleDateString() : ''}</TableCell>
      <TableCell>{formatBytes(object.Size)}</TableCell>
    </TableRow>
  );
};

export const FileListView: FC = () => {
  const s3Client = useContext(S3Context);
  const location = useLocation();
  const organization = location.state;
  const [path, setPath] = useState('/');
  const [objects, setObjects] = useState<S3Object[]>([]);

  useEffect(() => {
    getObjectsForPath(s3Client, organization.bucket, path).then((objs) => setObjects(objs));
  }, [path]);

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

        {objects.map((object) => <FileRowView object={object} setPath={setPath} />)}

      </Table>
    </TableContainer>
  );
}
