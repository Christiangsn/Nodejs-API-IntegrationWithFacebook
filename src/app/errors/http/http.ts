export class ServerError extends Error {
  constructor (
    error?: Error
  ) {
    super('Internal Server Error')
    this.name = 'Server Error'
    this.stack = error?.stack
  }
}
