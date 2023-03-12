import React, { useEffect, useState } from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    CircularProgress, Snackbar, Alert
} from '@mui/material';
import { CloudDownload, Delete } from '@mui/icons-material';
import { deleteFromS3, getOrganizationContents } from '../aws-client';

type Props = {
    s3BucketName: string;
};

type S3Object = {
    Key: string;
    LastModified: Date;
    Size: number;
};

export function InstitutionFiles({ s3BucketName }: Props) {
    const [files, setFiles] = useState<S3Object[]>([]);
    const [confirmDeleteOpen, setConfirmDeleteOpen] = useState<boolean>(false);
    const [fileToDelete, setFileToDelete] = useState<S3Object | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [deleteSuccess, setDeleteSuccess] = useState<boolean>(false);
    const [deleteError, setDeleteError] = useState<boolean>(false);

    useEffect(() => {
        async function getContents(s3BucketName: string) {
            console.log('Getting contents of bucket', s3BucketName);
            const s3Files: S3Object[] = await getOrganizationContents(s3BucketName);
            setFiles(s3Files)
        }
        getContents(s3BucketName);
    }, [s3BucketName]);

    async function handleDeleteClick(s3Key: string) {
        setFileToDelete(files.find((file) => file.Key === s3Key) || null);
        setConfirmDeleteOpen(true);
    }

    async function handleDeleteConfirm() {
        if (!fileToDelete) {
            return;
        }
        const params = {
            Bucket: s3BucketName,
            Key: fileToDelete.Key,
        };
        setLoading(true);
        const deleted = await deleteFromS3(params);
        setLoading(false);
        if (deleted) {
            setFiles(files.filter((file) => file.Key !== fileToDelete.Key));
            setDeleteSuccess(true);
            // TODO: Show a success message
        } else {
            setDeleteError(true);
        }
        setConfirmDeleteOpen(false);
        console.log('Deleting file', fileToDelete.Key);
    }

    function formatFileSize(fileSize: number) {
        if (fileSize < 1024) {
          return fileSize.toLocaleString() + " B";
        } else if (fileSize < 1048576) {
          return (fileSize / 1024).toFixed(2) + " KB";
        } else if (fileSize < 1073741824) {
          return (fileSize / 1048576).toFixed(2) + " MB";
        } else if (fileSize < 1099511627776) {
          return (fileSize / 1073741824).toFixed(2) + " GB";
        } else {
          return (fileSize / 1099511627776).toFixed(2) + " TB";
        }
      }

    function handleDeleteCancel() {
        setConfirmDeleteOpen(false);
        setFileToDelete(null);
    }

    function handleClose() {
        setDeleteSuccess(false);
        setDeleteError(false);
      }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '16px', textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
                Files in S3 bucket "{s3BucketName}"
            </Typography>
            {files.length === 0 ? (
                <Typography variant="body1" color="textSecondary">
                    No files found.
                </Typography>
            ) : (
                <TableContainer component={Paper} style={{ width: '100%', }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>File Name</TableCell>
                                <TableCell>Last Modified</TableCell>
                                <TableCell>Size</TableCell>
                                <TableCell />
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {files.map((file) => (
                                <TableRow key={file.Key}>
                                    <TableCell component="th" scope="row">
                                        {file.Key}
                                    </TableCell>
                                    <TableCell>{file.LastModified.toISOString()}</TableCell>
                                    <TableCell>{formatFileSize(file.Size)}</TableCell>
                                    <TableCell align="right">
                                        <IconButton color="primary" href={`https://${s3BucketName}.s3.amazonaws.com/${encodeURIComponent(file.Key)}`} download>
                                            <CloudDownload />
                                        </IconButton>
                                        <IconButton color="error" onClick={() => handleDeleteClick(file.Key)}>
                                            <Delete />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            <Dialog open={confirmDeleteOpen} onClose={handleDeleteCancel}>
                <DialogTitle>Delete File</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete the file "{fileToDelete?.Key}" from S3 bucket "{s3BucketName}"?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteCancel}>Cancel</Button>
                    <Button onClick={handleDeleteConfirm} color="secondary" autoFocus>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
            {loading && <CircularProgress size={24} />}
            <Snackbar open={deleteSuccess} autoHideDuration={5000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="success">
                    File deleted successfully.
                </Alert>
            </Snackbar>
            <Snackbar open={deleteError} autoHideDuration={5000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="error">
                    Error deleting file.
                </Alert>
            </Snackbar>
        </div>
    )
};