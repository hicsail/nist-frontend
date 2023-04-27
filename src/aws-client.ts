import {
  S3Client,
  ListObjectsCommand,
  PutObjectCommand,
  DeleteObjectCommand,
  ListObjectsV2Command,
  GetObjectCommand,
  GetObjectOutput,
} from "@aws-sdk/client-s3";
import { registerMiddleware } from "@bu-sail/cargo-middleware";

export const notclient = new S3Client({
  // endpoint: "http://localhost:8080/",
  // Get credentials from environment variables
  credentials: {
    accessKeyId: import.meta.env.VITE_AWS_KEY,
    secretAccessKey: import.meta.env.VITE_AWS_SECRET,
  },
  region: "us-east-1",
  forcePathStyle: true,
});

// Function to get the JWT. This function will be called on every request.
// const getJWTToken: () => Promise<string> = async () => {
//   return process.env.JWT_TOKEN;
// }

export const client = new S3Client({
  forcePathStyle: true,

  endpoint: "https://minio.sail.codes",

  // The following need to exist for the S3 Client to work, but the values
  // themselves do not matter
  region: "us-east-1",
  credentials: {
    accessKeyId: import.meta.env.VITE_AWS_KEY,
    secretAccessKey: import.meta.env.VITE_AWS_SECRET,
  },
});

//export const getAllBuckets = async () => {
type S3Object = {
  Key: string;
  LastModified: Date;
  Size: number;
};

export const getOrganizationContents = async (bucketName: string): Promise<S3Object[]> => {
  const command = new ListObjectsCommand({ Bucket: bucketName });
  // Execute the command and handle the response
  try {
    const data = await client.send(command);
    console.log("Success", data);
    // get info from data.Contents
    const contents = data.Contents;
    if (!contents) {
      throw new Error("No contents found");
    }

    let s3Objects: S3Object[] = [];
    for (const content of contents) {
      if (!content.Key || !content.LastModified) {
        continue;
      }
      s3Objects.push({
        Key: content.Key,
        LastModified: content.LastModified,
        Size: content.Size ? content.Size : 0,
      });
    }
    return s3Objects;
  } catch (error) {
    console.error("Error", error);
    throw error;
  }
};

export const uploadToS3 = async ({ Bucket, Key, Body }: any): Promise<boolean> => {
  const params = {
    Bucket: Bucket,
    Key: Key,
    Body: Body,
  };

  try {
    const command = new PutObjectCommand(params);
    await client.send(command);
    console.log(`File uploaded to S3 bucket "${Bucket}" with key "${Key}".`);
    return true;
  } catch (error) {
    console.error("Error uploading file:", error);
    return false;
  }
};

export const deleteFromS3 = async ({ Bucket, Key }: any): Promise<boolean> => {
  const params = {
    Bucket: Bucket,
    Key: Key,
  };

  try {
    const command = new DeleteObjectCommand(params);
    await client.send(command);
    console.log(`File deleted from S3 bucket "${Bucket}" with key "${Key}".`);
    return true;
  } catch (error) {
    console.error("Error deleting file:", error);
    return false;
  }
};

export const createFolder = async (bucketName: string, folderName: string) => {
  const params = {
    Bucket: bucketName,
    Key: `${folderName}/`,
    Body: "",
  };

  const command = new PutObjectCommand(params);

  try {
    await client.send(command);
    console.log(`Successfully created folder ${folderName} in bucket ${bucketName}`);
  } catch (err) {
    console.log(`Error creating folder: ${err}`);
  }
};

export const listFolders = async (bucketName: string, prefix = "") => {
  const params = {
    Bucket: bucketName,
    Prefix: prefix,
    Delimiter: "/",
  };

  const command = new ListObjectsV2Command(params);

  try {
    const response = await client.send(command);
    if (!response.CommonPrefixes) {
      throw new Error("No folders found");
    }
    const folders = response.CommonPrefixes.map((prefix) => prefix.Prefix);
    console.log(`Folders in ${bucketName}/${prefix}:`, folders);
    return folders;
  } catch (err) {
    console.log(`Error listing folders: ${err}`);
    return [];
  }
};

export const getFolderContents = async (bucketName: string, folderKey: string): Promise<any[]> => {
  const command = new ListObjectsCommand({
    Bucket: bucketName,
    Prefix: folderKey,
    Delimiter: "/",
  });

  try {
    const response = await client.send(command);
    return response.Contents ?? [];
  } catch (err) {
    console.error(
      `Error fetching contents of folder '${folderKey}' in bucket '${bucketName}': ${err}`
    );
    return [];
  }
};

export const getFile = async (bucketName: string, key: string): Promise<any | null> => {
  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: key,
  });

  try {
    const response = await client.send(command);
    return response;
  } catch (err) {
    console.error(`Error fetching file '${key}' in bucket '${bucketName}': ${err}`);
    return null;
  }
};

export const downloadFile = async (bucketName: string, key: string): Promise<void> => {
  const getObjectCommand = new GetObjectCommand({ Bucket: bucketName, Key: key });

  try {
    const response: GetObjectOutput = await client.send(getObjectCommand);
    const fileData: string = await streamToString(response.Body as ReadableStream<Uint8Array>);
    downloadData(fileData, key);
  } catch (err) {
    console.error(err);
  }
};

const streamToString = async (stream: ReadableStream<Uint8Array>): Promise<string> => {
  const reader = stream.getReader();
  const chunks: Uint8Array[] = [];
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (value) chunks.push(value);
  }
  const decoder = new TextDecoder();
  return chunks.map((chunk) => decoder.decode(chunk)).join("");
};

const downloadData = (data: string, filename: string): void => {
  const blob = new Blob([data], { type: "application/octet-stream" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
};

export const deleteFile = async (bucketName: string, key: string): Promise<boolean> => {
  const deleteObjectCommand = new DeleteObjectCommand({ Bucket: bucketName, Key: key });

  try {
    await client.send(deleteObjectCommand);
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
};
