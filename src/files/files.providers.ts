import { NotFound, S3 } from '@aws-sdk/client-s3';

export const FilesProviders = [
  {
    provide: 'S3_BUCKET',
    useFactory: async () => {
      let config: any = {
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY,
          secretAccessKey: process.env.S3_SECRET_KEY,
        },
        region: process.env.S3_REGION || 'us-east-1',
        signatureVersion: 'v4',
      };

      // for S3 Minio
      if (process.env.S3_ENDPOINT) {
        config = {
          ...config,
          endpoint: process.env.S3_ENDPOINT,
          forcePathStyle: true,
        };
      }

      const s3 = new S3(config);

      // Check on exist bucket
      const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME;
      try {
        await s3.headBucket({ Bucket: S3_BUCKET_NAME });
      } catch (error) {
        if (error instanceof NotFound) {
          console.log(`Bucket with name "${S3_BUCKET_NAME}" - NOT FOUND`);
          try {
            console.log(
              `Trying to create a bucket with the name "${S3_BUCKET_NAME}"`,
            );
            s3.createBucket({ Bucket: 'upload' }).then(() => {
              console.log(`Bucket with name "${S3_BUCKET_NAME} created"`);
            });
          } catch (error) {
            console.log(`Try created bucket faled`);
          }
        }
      }

      return s3;
    },
  },
];
