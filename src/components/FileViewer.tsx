import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Tooltip, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, TextField } from '@mui/material';
import { Delete, Edit, GetApp } from '@mui/icons-material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

type LabFile = {
    id: number;
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
    s3Bucket: string;
    s3Key: string;
    fileSize: number;
    fileUrl: string;
};

type Props = {
    labFiles: LabFile[];
};

const theme = createTheme();

export default function BiologyLabFilesTable({ labFiles }: Props) {
    const [selectedFile, setSelectedFile] = useState<LabFile | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogText, setDialogText] = useState('');

    const tableRowStyle = {
        cursor: 'pointer',
        '&:hover': {
            backgroundColor: theme.palette.action.hover,
        },
    };

    const tableCellStyle = {
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    };

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
      

    function handleTableRowClick(file: LabFile) {
        setSelectedFile(file);
    }

    function handleCloseDialog() {
        setDialogOpen(false);
    }

    function handleDownloadClick(file: LabFile) {
        window.open(file.fileUrl, '_blank');
    }

    function handleDeleteClick(file: LabFile) {
        setDialogText(`Are you sure you want to delete the file "${file.name}"?`);
        setDialogOpen(true);
    }

    function handleUpdateClick(file: LabFile) {
        setDialogText(`Enter a new name for the file "${file.name}":`);
        setDialogOpen(true);
    }

    function handleDialogSubmit() {
        // TODO: Handle file delete/update on the server
        if (selectedFile) {
            if (dialogText === '') {
                console.log(`File "${selectedFile.name}" deleted.`);
            } else {
                console.log(`File "${selectedFile.name}" updated with new name "${dialogText}".`);
            }
        }
        setSelectedFile(null);
        setDialogOpen(false);
        setDialogText('');
    }

    return (
        <ThemeProvider theme={theme}>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell>Created At</TableCell>
                            <TableCell>Updated At</TableCell>
                            <TableCell>File Size</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {labFiles.map(file => (
                            <TableRow key={file.id} sx={tableRowStyle} onClick={() => handleTableRowClick(file)}>
                                <TableCell sx={tableCellStyle}>{file.name}</TableCell>
                                <TableCell sx={tableCellStyle}>{file.description}</TableCell>
                                <TableCell sx={tableCellStyle}>{new Date(file.createdAt).toLocaleString()}</TableCell>
                                <TableCell sx={tableCellStyle}>{new Date(file.updatedAt).toLocaleString()}</TableCell>
                                <TableCell sx={tableCellStyle}>{formatFileSize(file.fileSize)}</TableCell>
                                <TableCell sx={tableCellStyle}>
                                    <Tooltip title="Download">
                                        <IconButton onClick={() => handleDownloadClick(file)}>
                                            <GetApp />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Delete">
                                        <IconButton onClick={() => handleDeleteClick(file)}>
                                            <Delete />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Update">
                                        <IconButton onClick={() => handleUpdateClick(file)}>
                                            <Edit />
                                        </IconButton>
                                    </Tooltip>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Dialog open={dialogOpen} onClose={handleCloseDialog}>
                <DialogTitle>{selectedFile ? `File "${selectedFile.name}"` : ''}</DialogTitle>
                <DialogContent>
                    <DialogContentText>{dialogText}</DialogContentText>
                    {selectedFile && dialogText !== '' && (
                        <TextField
                            autoFocus
                            margin="dense"
                            label="New Name"
                            fullWidth
                            value={dialogText}
                            onChange={(event: any) => setDialogText(event.target.value)}
                        />
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleDialogSubmit} color="primary">
                        {selectedFile && dialogText === '' ? 'Delete' : 'Update'}
                    </Button>
                </DialogActions>
            </Dialog>
        </ThemeProvider>
    )
};