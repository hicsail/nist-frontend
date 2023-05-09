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
  AlertColor,
  Grid
} from '@mui/material';
import { FC, useContext, useState, useEffect, ReactNode, Dispatch, SetStateAction, MouseEvent } from 'react';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import DeleteIcon from '@mui/icons-material/Delete';
import FolderIcon from '@mui/icons-material/Folder';
import { S3Context } from '../contexts/s3.context';
import { ListObjectsCommand, S3Client, _Object as S3Object } from '@aws-sdk/client-s3';
import { useLocation, useNavigate } from 'react-router-dom';
import { deleteFile, deleteFolder, downloadFile } from '../aws-client';
import { OrganizationContext } from '../contexts/organization.context';
import EnhancedTableHead, { Order } from './EnhancedTableHead';

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

  const deleteHandler = async () => {
    const deleteFunction = isFolder ? deleteFolder : deleteFile;
    const type = isFolder ? 'folder': 'file';
    const deleteResult = await deleteFunction(s3Client, organization!.bucket, object.Key!);

    const snackBarSettings = { message: `${type} deleted successfully`, open: true, severity: 'success' as AlertColor };
    if (!deleteResult) {
      snackBarSettings.message = `Failed to delete ${type}`;
      snackBarSettings.severity = 'error';
    }

    setShouldReload(true);
    setSnackBarSettings(snackBarSettings);
  }

  const operations = (
    <Grid container spacing={1} style={{ alignItems: 'center', display: 'flex'}}>
      <Grid item xs={2}>
        {
          // Currently do not support downloading folder so just need a
          // placeholder to maintain spacing
          isFolder ?
          <></> :
          <IconButton onClick={() => downloadFile(s3Client, organization!.bucket, object.Key!)}><FileDownloadIcon /></IconButton>
        }
      </Grid>
      <Grid item xs={2}>
        <IconButton onClick={deleteHandler}>
          <DeleteIcon />
        </IconButton>
      </Grid>
    </Grid>
  );

  return (
    <TableRow>
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
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<string>('Key');
  const [orderedObjects, setOrderedObjects] = useState<S3Object[]>([]);

  const loadFiles = async () => {
    const objs = await getObjectsForPath(s3Client, props.bucket!, props.path);
    setObjects(objs);
  };

  const handleRequestSort = (_event: MouseEvent<unknown>, property: string) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc': 'asc');
    setOrderBy(property);
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

  // Handle sorting the objects
  useEffect(() => {
    setOrderedObjects(objects.slice().sort((a: any, b: any) => {
      const direction = order === 'asc' ? 1: -1;
      return a[orderBy] > b[orderBy] ? direction: -direction;
    }));
  }, [objects, order, orderBy]);

  const columns = [
    { label: 'Name', id: 'Key' },
    { label: 'Created Date', id: 'LastModified' },
    { label: 'Size', id: 'Size' },
    { label: '', id: 'Actions' }
  ];

  return (
    <TableContainer component={Paper} sx={{ minWidth: 650 }}>
      <Table>
        <EnhancedTableHead
          onRequestSort={handleRequestSort}
          columns={columns}
          sortableIds={['Key', 'LastModified', 'Size']}
          order={order}
          orderBy={orderBy}
        />
        <TableBody>
          {orderedObjects.map((object) =>
            <FileRowView object={object} setShouldReload={props.setShouldReload} setSnackBarSettings={props.setSnackBarSettings} key={object.Key!}/>)
          }
        </TableBody>
      </Table>
    </TableContainer>
  );
}
