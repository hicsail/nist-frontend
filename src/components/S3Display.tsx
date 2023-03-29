import React from 'react'
import { useState, useEffect } from "react";
import {
    Button,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { getOrganizationContents, getFolderContents, uploadToS3 } from "../aws-client";
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

function FolderItem({ folderName, s3BucketName, lastModified }: { folderName: string, s3BucketName: string, lastModified: Date }) {
    const [expanded, setExpanded] = useState(false);
    const [folderContents, setFolderContents] = useState<S3.Object[]>([]);
    const isFolder = folderName.endsWith("/");
    const folderKey = folderName.slice(0, -1);

    const handleExpand = async () => {
        if (!expanded) {
            const contents = await getFolderContents(s3BucketName, folderKey);
            console.log(contents);
            setFolderContents(contents);
        }
        setExpanded(!expanded);
    };

    const onDrop = async (acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        const fileName = `${folderKey}${file.name}`;
        const uploadOptions: UploadOptions = {
            Bucket: s3BucketName,
            Key: fileName,
            Body: file,
        };
        const success = await uploadToS3(uploadOptions);
        if (success) {
            const contents = await getFolderContents(s3BucketName, folderKey);
            setFolderContents(contents);
        }
    };

    const { getRootProps, getInputProps } = useDropzone({ onDrop });

    return (
        <>
            <TableRow onClick={handleExpand}>
                <TableCell>
                    Folder
                </TableCell>
                <TableCell>
                    {folderKey}
                </TableCell>
                <TableCell>
                    {lastModified.toISOString()}
                </TableCell>
                <TableCell>
                    {expanded ? <KeyboardArrowDownIcon /> : <KeyboardArrowRightIcon />}
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
                        {isFolder && <FileList files={folderContents} />}
                    </TableCell>
                </TableRow>
            )}
        </>
    );
}

function S3FileList({ files, s3BucketName }: { files: any[], s3BucketName: string }) {
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
                            File
                        </TableCell>
                        <TableCell>{file.Key}</TableCell>
                        <TableCell>{file.LastModified.toISOString()}</TableCell>
                        <TableCell>{file.Size}</TableCell>
                    </TableRow>
                );
            })}
        </>
    );
}


export default function ({ s3BucketName }: { s3BucketName: string }) {

    const [files, setFiles] = useState<any>([]);

    useEffect(() => {
        async function fetchS3Contents() {
            const contents = await getOrganizationContents(s3BucketName);
            setFiles(contents);
        }
        fetchS3Contents();
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
    )
}
