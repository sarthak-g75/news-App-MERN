import { s3 } from '@aws-sdk/client-s3'

const s3Config = new s3({
  region: 'ap-south-1',
  Credentials: {
    accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY,
    secretAccessKey: import.meta.env.VITE_AWS_SECRET_KEY,
  },
})
