export const env = {
  facebookApi: {
    clientId: process.env.FB_CLIENT_ID ?? '',
    clientSecret: process.env.FB_CLIENT_SECRET ?? ''
  },
  appPort: process.env.APP_PORT ?? '',
  jwtSecret: process.env.JWT_SECRET ?? ''
}
