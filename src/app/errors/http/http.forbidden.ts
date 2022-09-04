export class ForbiddenError extends Error {
  constructor () {
    super('Acess denied')
    this.name = 'Server Error'
  }
}
