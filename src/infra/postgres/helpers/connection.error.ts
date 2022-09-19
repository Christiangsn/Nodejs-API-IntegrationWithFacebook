export class ConnectionNotFoundError extends Error {
  constructor () {
    super()
    this.name = 'ConnectionNotFoundError'
  }
}
