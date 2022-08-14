export class AnauthorizedError extends Error {
  constructor () {
    super('Anauthorized')
    this.name = 'Server Error'
  }
}
