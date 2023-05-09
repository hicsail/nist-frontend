import {
  S3Client,
  ListObjectsCommand,
  PutObjectCommand,
  DeleteObjectCommand,
  ListObjectsV2Command,
  GetObjectCommand,
  GetObjectOutput,
  DeleteObjectsCommand,
} from "@aws-sdk/client-s3";

//export const getAllBuckets = async () => {
type S3Object = {
  Key: string;
  LastModified: Date;
  Size: number;
};

export const getOrganizationContents = async (client: S3Client, bucketName: string): Promise<S3Object[]> => {
  const command = new ListObjectsCommand({ Bucket: bucketName });
  // Execute the command and handle the response
  try {
    const data = await client.send(command);
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

export const uploadToS3 = async (client: S3Client, { Bucket, Key, Body }: any): Promise<boolean> => {
  const params = {
    Bucket: Bucket,
    Key: Key,
    Body: Body,
  };

  try {
    const command = new PutObjectCommand(params);
    await client.send(command);
    return true;
  } catch (error) {
    console.error("Error uploading file:", error);
    return false;
  }
};

export const deleteFromS3 = async (client: S3Client, { Bucket, Key }: any): Promise<any> => {
  const params = {
    Bucket: Bucket,
    Key: Key,
  };

  try {
    const command = new DeleteObjectCommand(params);
    await client.send(command);
    const message = `File deleted from S3 bucket "${Bucket}" with key "${Key}".`;
    return {
      success: true,
      message,
    };
  } catch (error) {
    const message = `Error deleting file:', ${error}`;
    return {
      success: false,
      message,
    };
  }
};

export const createFolder = async (client: S3Client, bucketName: string, folderName: string) => {
  const params = {
    Bucket: bucketName,
    Key: `${folderName}/`,
    Body: "",
  };

  const command = new PutObjectCommand(params);

  try {
    await client.send(command);

  } catch (err) {
    console.log(`Error creating folder: ${err}`);
  }
};

export const listFolders = async (client: S3Client, bucketName: string, prefix = "") => {
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
    return folders;
  } catch (err) {
    console.log(`Error listing folders: ${err}`);
    return [];
  }
};

export const getFolderContents = async (
  client: S3Client,
  bucketName: string,
  folderKey: string
): Promise<any[]> => {
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

export const getFile = async (client: S3Client, bucketName: string, key: string): Promise<any | null> => {
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

export const downloadFile = async (client: S3Client, bucketName: string, key: string): Promise<void> => {
  const getObjectCommand = new GetObjectCommand({ Bucket: bucketName, Key: key });
  const components = key.split('/');
  const filename = components[components.length - 1];

  try {
    const response: GetObjectOutput = await client.send(getObjectCommand);
    const fileData: string = await streamToString(response.Body as ReadableStream<Uint8Array>);
    downloadData(fileData, filename);
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

export const deleteFile = async (client: S3Client, bucketName: string, key: string): Promise<boolean> => {
  const deleteObjectCommand = new DeleteObjectCommand({ Bucket: bucketName, Key: key });

  try {
    await client.send(deleteObjectCommand);
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
};

export const deleteFolder = async (client: S3Client, bucketName: string, key: string): Promise<boolean> => {
  try {
    // Get all the objects contained in the folder
    const contained = await client.send(new ListObjectsCommand({ Bucket: bucketName, Prefix: key }));
    if (!contained.Contents) {
      return false;
    }

    // Delete all contained objects
    await client.send(new DeleteObjectsCommand({
      Bucket: bucketName,
      Delete: {
        // Since the objects are queried based on prefix, the key has to
        // exist
        Objects: (contained.Contents as { Key: string}[])
      }
    }));

  } catch (err) {
    console.error(err);
    return false;
  }

  return true;
};
