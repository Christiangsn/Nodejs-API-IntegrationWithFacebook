export class TAuthenticationError extends Error {
  constructor () {
    super('Authentication failed')
    this.name = 'AuthenticationError'
  }
}
