import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { fromSSO, fromTemporaryCredentials } from '@aws-sdk/credential-providers';

const isProd = process.env.NODE_ENV === 'production';
console.log('====================== s3Client.ts ======================');
console.log('process.env.NODE_ENV:', process.env.NODE_ENV);
console.log('isProd:', isProd);
console.log('process.env.AWS_ROLE_ARN:', process.env.AWS_ROLE_ARN);
console.log('==========================================================');

const client = isProd
  ? new S3Client({
      region: 'us-east-1',
      credentials: fromTemporaryCredentials({
        params: {
          RoleArn: process.env.AWS_ROLE_ARN ?? '',
          RoleSessionName: 'nextjs-s3-client',
          DurationSeconds: 3600,
        },
        clientConfig: { region: 'us-east-1' },
      }),
    })
  : new S3Client({
      region: 'us-east-1',
      credentials: fromSSO({
        profile: 'personal-sso-access',
      }),
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
