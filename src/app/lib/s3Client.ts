import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { fromEnv } from '@aws-sdk/credential-providers';

const client = new S3Client({
  region: 'us-east-1',
  credentials: fromEnv(),
});

export const getObject = async (bucketName: string, objectPath: string): Promise<string | undefined> => {
  console.log('================== getObject ==================');
  console.log('bucketName:', bucketName);
  console.log('objectPath:', objectPath);
  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: objectPath,
  });

  const data = await client
    .send(command)
    .then(async (res) => {
      console.log('res:', JSON.stringify(res.$metadata));
      const data = await res.Body?.transformToString();
      return data;
    })
    .catch((err) => {
      console.error('error has occurred:', err);
      return undefined;
    });
  console.log('===============================================');
  return data;
};
