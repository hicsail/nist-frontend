import React from "react";
import { useState, useEffect, useContext } from 'react';
import { S3Context } from '../contexts/s3.context';
import {
  Button,
  Paper,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
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

function FileList({ files }: { files: any[] }) {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Last Modified</TableCell>
            <TableCell>Size</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {files.map((file: any) => (
            <TableRow key={file.Key}>
              <TableCell>{file.Key}</TableCell>
              <TableCell>{file.LastModified.toISOString()}</TableCell>
              <TableCell>{file.Size}</TableCell>
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
      <TableRow onClick={handleExpand}>
        <TableCell>Folder</TableCell>
        <TableCell>{folderKey}</TableCell>
        <TableCell>{lastModified.toISOString()}</TableCell>
        <TableCell>{expanded ? <KeyboardArrowDownIcon /> : <KeyboardArrowRightIcon />}</TableCell>
        <TableCell>
          <div {...getRootProps()}>
            <input {...getInputProps()} />
            <Button>Upload</Button>
          </div>
        </TableCell>
      </TableRow>
      {expanded && (
        <TableRow>
          <TableCell colSpan={3}>{isFolder && <FileList files={folderContents} />}</TableCell>
        </TableRow>
      )}
    </>
  );
}

function S3FileList({ files, s3BucketName }: { files: any[]; s3BucketName: string }) {
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
            <TableCell>File</TableCell>
            <TableCell>{file.Key}</TableCell>
            <TableCell>{file.LastModified.toISOString()}</TableCell>
            <TableCell>{file.Size}</TableCell>
            <TableCell>
              <Button
                onClick={async () => {
                  const success = await deleteFile(s3Client, s3BucketName, file.Key);
                  if (success) setMessage("File deleted successfully");
                  else setMessage("File deletion failed");
                  setOpen(true);
                }}
              >
                Delete
              </Button>
              <Button
                onClick={async () => {
                  await downloadFile(s3Client, s3BucketName, file.Key);
                  setMessage("File downloaded successfully");
                  setOpen(true);
                }}
              >
                Download
              </Button>
            </TableCell>
          </TableRow>
        );
      })}
      <Snackbar open={open} autoHideDuration={2000} onClose={handleClose} message={message} />
    </>
  );
}

export default function ({ s3BucketName }: { s3BucketName: string }) {
  const [files, setFiles] = useState<any>([]);
  const s3Client = useContext(S3Context);

  useEffect(() => {
    getOrganizationContents(s3Client, s3BucketName).then((contents) => setFiles(contents));
  }, [s3BucketName]);

  return (
    <div>
      <TableContainer>
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
            <S3FileList files={files} s3BucketName={s3BucketName} />
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
