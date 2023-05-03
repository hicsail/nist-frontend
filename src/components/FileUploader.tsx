import React, { useState, useContext } from 'react';
import { Alert, Button, Paper, Snackbar, Typography } from '@mui/material';
import { uploadToS3 } from '../aws-client';
import { S3Context } from '../contexts/s3.context';

const dropZoneStyle = {
    width: '100%',
    minHeight: '100px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    border: `2px dashed primary`,
    padding: '16px',
    marginTop: '16px',
    cursor: 'pointer',
};

type Props = {
    s3BucketName: string;
};

function FileUploader({ s3BucketName }: Props) {
    const [file, setFile] = useState<File | null>(null);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarSeverity, setSnackbarSeverity] = useState<any>("success");
    const s3Client = useContext(S3Context);

    function handleFileSelect(event: React.ChangeEvent<HTMLInputElement>) {
        setFile(event.target.files && event.target.files[0]);
    }

    function handleDropZoneClick() {
        document.getElementById('fileInput')?.click();
    }

    function handleDragOver(event: React.DragEvent<HTMLDivElement>) {
        event.preventDefault();
        event.stopPropagation();
    }

    function handleDrop(event: React.DragEvent<HTMLDivElement>) {
        event.preventDefault();
        event.stopPropagation();

        if (event.dataTransfer.files.length > 0) {
            setFile(event.dataTransfer.files[0]);
        }
    }

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    async function handleUploadClick() {
        if (!file) {
            return;
        }

        const params = {
            Bucket: s3BucketName,
            Key: file.name,
            Body: file,
        };

        setSnackbarMessage(`Uploading file ${file.name} to S3 bucket ${s3BucketName}`);
        setSnackbarSeverity("info");
        setOpenSnackbar(true);
        const success = await uploadToS3(s3Client, params);
        if (success){
            setSnackbarMessage(`Successfully uploaded file ${file.name} to S3 bucket ${s3BucketName}`);
            setSnackbarSeverity("success");
            setOpenSnackbar(true);
        } else {
            setSnackbarMessage(`Failed to upload file ${file.name} to S3 bucket ${s3BucketName}`);
            setSnackbarSeverity("error");
            setOpenSnackbar(true);
        }
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '16px', textAlign: 'center' }}>
            <input
                id="fileInput"
                type="file"
                accept=".pdf,.doc,.docx,.xls,.xlsx"
                onChange={handleFileSelect}
                style={{ display: 'none' }}
            />
            <Typography variant="h6" gutterBottom>
                Select or drag and drop a file
            </Typography>
            <Paper
                sx={dropZoneStyle}
                onClick={handleDropZoneClick}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
            >
                <Typography variant="body1" color="textSecondary">
                    {file ? file.name : 'No file selected'}
                </Typography>
            </Paper>
            {file && (
                <Button variant="contained" color="primary" onClick={handleUploadClick} style={{ marginTop: '16px' }}>
                    Upload File
                </Button>
            )}

            <div>
                <Snackbar
                    open={openSnackbar}
                    autoHideDuration={5000}
                    onClose={handleCloseSnackbar}
                >
                    <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity}>
                        {snackbarMessage}
                    </Alert>
                </Snackbar>
            </div>
        </div>
    );
}

export default FileUploader;
