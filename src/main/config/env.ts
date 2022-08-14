export const env = {
  facebookApi: {
    clientId: process.env.FB_CLIENT_ID ?? '472982581266582',
    clientSecret: process.env.FB_CLIENT_SECRET ?? '781c8107b5f97ab0aa8b36eb3e7f6cb2'
  },
  appPort: process.env.APP_PORT ?? 8080,
  jwtSecret: process.env.JWT_SECRET ?? 'FSAIJjsajkkas'
}
