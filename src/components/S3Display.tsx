import React from "react";
import { useState, useEffect, useContext } from 'react';
import { S3Context } from '../contexts/s3.context';
import {
  Button,
  IconButton,
  Paper,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import {
  getOrganizationContents,
  getFolderContents,
  uploadToS3,
  downloadFile,
  deleteFile,
} from "../aws-client";
import { useDropzone } from "react-dropzone";
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import DeleteIcon from '@mui/icons-material/Delete';
import GetAppIcon from '@mui/icons-material/GetApp';
import {PermissionsContext} from "../contexts/Permissions";

function formatBytes(size: number): string {
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let n = 0;
  while (size >= 1024 && n < units.length - 1) {
    size /= 1024;
    n++;
  }
  return `${size.toFixed(2)} ${units[n]}`;
}

function FileList({ files, s3BucketName }: { files: any[], s3BucketName: string }) {
  const s3Client = useContext(S3Context);
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Last Modified</TableCell>
            <TableCell>Size</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {files.map((file: any) => (
            <TableRow key={file.Key}>
              <TableCell>{file.Key}</TableCell>
              <TableCell>{file.LastModified.toISOString()}</TableCell>
              <TableCell>{formatBytes(file.Size)}</TableCell>
              <TableCell>
                <IconButton size="small" onClick={() => downloadFile(s3Client, s3BucketName, file.Key)}>
                  <GetAppIcon />
                </IconButton>
                <IconButton size="small" onClick={() => deleteFile(s3Client, s3BucketName, file.Key)}>
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

function FolderItem({
  folderName,
  s3BucketName,
  lastModified,
}: {
  folderName: string;
  s3BucketName: string;
  lastModified: Date;
}) {
  const [expanded, setExpanded] = useState(false);
  const [folderContents, setFolderContents] = useState<any[]>([]);
  const isFolder = folderName.endsWith("/");
  const folderKey = folderName.slice(0, -1);
  const s3Client = useContext(S3Context);

  const handleExpand = async () => {
    if (!expanded) {
      const contents = await getFolderContents(s3Client, s3BucketName, folderKey);
      console.log(contents);
      setFolderContents(contents);
    }
    setExpanded(!expanded);
  };

  const onDrop = async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    const fileName = `${folderKey}${file.name}`;
    const uploadOptions: any = {
      Bucket: s3BucketName,
      Key: fileName,
      Body: file,
    };
    const success = await uploadToS3(s3Client, uploadOptions);
    if (success) {
      const contents = await getFolderContents(s3Client, s3BucketName, folderKey);
      setFolderContents(contents);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <>
      <TableRow>
        <TableCell>
          <IconButton size="small" onClick={handleExpand}>
            {expanded ? <KeyboardArrowDownIcon /> : <KeyboardArrowRightIcon />}
          </IconButton>
          Folder
        </TableCell>
        <TableCell>
          {folderKey}
        </TableCell>
        <TableCell>
          {lastModified.toDateString()}
        </TableCell>
        <TableCell>
        </TableCell>
        <TableCell>
          <div {...getRootProps()}>
            <input {...getInputProps()} />
            <Button>Upload</Button>
          </div>
        </TableCell>
      </TableRow>
      {expanded && (
        <TableRow>
          <TableCell colSpan={3}>
            {isFolder && <FileList files={folderContents} s3BucketName={s3BucketName} />}
          </TableCell>
        </TableRow>
      )}
    </>
  );
}

function S3FileList({ files, s3BucketName, reloadFiles }: { files: any[], s3BucketName: string, reloadFiles: () => void }) {

  // state variables to control toast display
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const handleClose = () => setOpen(false);
  const s3Client = useContext(S3Context);


  return (
    <>
      {files.map((file) => {
        const isFolder = file.Key.endsWith("/");
        return isFolder ? (
          <FolderItem
            key={file.Key}
            folderName={file.Key}
            s3BucketName={s3BucketName}
            lastModified={file.LastModified}
          />
        ) : (
          <TableRow key={file.Key}>
            <TableCell>
              <IconButton size="small">
                <ArticleOutlinedIcon />
              </IconButton>
              File
            </TableCell>
            <TableCell>{file.Key}</TableCell>
            <TableCell>{file.LastModified.toDateString()}</TableCell>
            <TableCell>{formatBytes(file.Size)}</TableCell>
            <TableCell>
              <IconButton size='small' onClick={async () => {
                if (confirm("Are you sure you want to delete this file?")) {
                  const success = await deleteFile(s3Client, s3BucketName, file.Key)
                  if (success) setMessage("File deleted successfully");
                  setOpen(true);
                  reloadFiles();
                }
              }
              }>
                <DeleteIcon />
              </IconButton>
              <IconButton onClick={async () => {
                await downloadFile(s3Client, s3BucketName, file.Key)
                setMessage("File downloaded successfully");
                setOpen(true);
              }}>
                <GetAppIcon />
              </IconButton>
            </TableCell>
          </TableRow>
        );
      })}
      <Snackbar
        open={open}
        autoHideDuration={2000}
        onClose={handleClose}
        message={message}
      />
    </>
  );
}

export default function ({ s3BucketName, files, loadFiles }: { s3BucketName: string, files: any[], loadFiles: () => void }) {

  const [filteredFiles, setFilteredFiles] = useState<any>([]);
  const s3Client = useContext(S3Context);

  const handleFilter = (event: any) => {
    const searchQuery = event.target.value;
    const filteredFiles = files.filter((file: any) => file.Key.includes(searchQuery));
    console.log(filteredFiles);
    setFilteredFiles(filteredFiles);
  };

  useEffect(() => {
    setFilteredFiles(files);
  }, [files]);

  return (
    <div>
      <TableContainer>
        <TextField id="outlined-basic" label="Search Files" variant="outlined" onChange={handleFilter} />
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Type</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Last Modified</TableCell>
              <TableCell>Size</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <S3FileList files={filteredFiles} s3BucketName={s3BucketName} reloadFiles={loadFiles} />
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}
