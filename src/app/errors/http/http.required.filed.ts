export class RequiredFieldError extends Error {
  constructor (
    fieldName?: string
  ) {
    const message = fieldName === undefined ? 'Field is Required' : `The ${fieldName} is required`
    super(message)
    this.name = 'Server Error'
  }
}
