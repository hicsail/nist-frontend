import React, { useEffect, useState } from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    ListItem,
    ListItemIcon,
    ListItemText,
    Paper,
    Typography,
} from '@mui/material';
import { CloudDownload, Delete } from '@mui/icons-material';
import { getOrganizationContents } from '../aws-client';

type Props = {
    s3BucketName: string;
};

type S3Object = {
    Key: string;
    LastModified: Date;
    Size: number;
};

export function S3FileViewer({  s3BucketName }: Props) {
    const [files, setFiles] = useState<S3Object[]>([]);
    const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
    const [fileToDelete, setFileToDelete] = useState<S3Object | null>(null);

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
        console.log('Deleting file', fileToDelete?.Key);
        setConfirmDeleteOpen(false);
        setFileToDelete(null);
    }

    function handleDeleteCancel() {
        setConfirmDeleteOpen(false);
        setFileToDelete(null);
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
                <div style={{ width: '100%', maxWidth: '800px' }}>
                    {files.map((file) => (
                        <Paper key={file.Key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', padding: '8px' }}>
                            <ListItem style={{ flex: 1 }}>
                                <ListItemText
                                    primary={file.Key}
                                    secondary={`Last modified: ${file.LastModified.toISOString()} | Size: ${file.Size.toLocaleString()} bytes`}
                                />
                            </ListItem>
                            <ListItemIcon>
                                <Button variant="outlined" color="primary" startIcon={<CloudDownload />} href={`https://${s3BucketName}.s3.amazonaws.com/${encodeURIComponent(file.Key)}`}>Download</Button>
                            </ListItemIcon>
                            <ListItemIcon>
                                <Button variant="outlined" color="secondary" startIcon={<Delete />} onClick={() => handleDeleteClick(file.Key)}>
                                    Delete
                                </Button>
                            </ListItemIcon>
                        </Paper>
                    ))}
                </div>
            )
            }
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
        </div >
    )
};
