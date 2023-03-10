import { S3Client, AbortMultipartUploadCommand, ListObjectsCommand, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";

const client = new S3Client({
  //endpoint: "http://localhost:8080/",
  // Get credentials from environment variables
  credentials: {
    accessKeyId: import.meta.env.VITE_AWS_KEY,
    secretAccessKey: import.meta.env.VITE_AWS_SECRET,
  },
  region: "us-east-1",
  forcePathStyle: true
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
      if (!content.Key || !content.LastModified || !content.Size) {
        continue;
      }
      s3Objects.push({
        Key: content.Key,
        LastModified: content.LastModified,
        Size: content.Size,
      });
    }
    return s3Objects;

  } catch (error) {
    console.error("Error", error);
    throw error;
  }
}

export const uploadToS3 = async ({Bucket, Key, Body }: UploadOptions): Promise<boolean> => {
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
    console.error('Error uploading file:', error);
    throw error;
    return false;
  }
}

export const deleteFromS3 = async ({ Bucket, Key }: DeleteOptions): Promise<boolean> => {
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
    console.error('Error deleting file:', error);
    return false;
  }
}
