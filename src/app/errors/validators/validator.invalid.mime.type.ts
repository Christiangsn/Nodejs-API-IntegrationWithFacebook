export class InvalidMymeTypeError extends Error {
  constructor (public allowed: string[]) {
    super(`Unsupported type. Allowed types: ${allowed.join(', ')} `)
    this.name = 'Unsupported type'
  }
}
