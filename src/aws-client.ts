import { S3Client, AbortMultipartUploadCommand, ListObjectsCommand } from "@aws-sdk/client-s3";

const client = new S3Client({
  //endpoint: "http://localhost:8080/",
  // Get credentials from environment variables
  credentials: {
    accessKeyId: 'AKIAR7IMRMF7YBDJFXLE',
    secretAccessKey: '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',
  },
  region: "us-east-1",
  forcePathStyle: true
});


//export const getAllBuckets = async () => {

export const getOrganizationContents = (bucketName: string) => {
  const command = new ListObjectsCommand({ Bucket: bucketName });

  // Execute the command and handle the response
  client.send(command).then(data => {
      console.log("Bucket contents:", data.Contents);
    }).catch(error => {
      console.error("Error listing bucket contents:", error);
  });

}
