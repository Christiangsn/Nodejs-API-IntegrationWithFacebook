export const env = {
  facebookApi: {
    clientId: process.env.FB_CLIENT_ID ?? '',
    clientSecret: process.env.FB_CLIENT_SECRET ?? ''
  },
  appPort: process.env.APP_PORT ?? '',
  jwtSecret: process.env.JWT_SECRET ?? '',
  s3: {
    accessKey: process.env.AWS_S3_ACCESS_KEY ?? '',
    secret: process.env.AWS_S3_ACCESS_SECRET ?? '',
    bucket: process.env.AWS_S3_ACCESS_BUCKET ?? ''
  }
}
