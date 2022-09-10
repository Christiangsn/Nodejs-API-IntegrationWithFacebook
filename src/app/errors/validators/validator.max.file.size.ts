export class MaxFileSizeError extends Error {
  constructor (public maxSizeInMb: number) {
    super(`File upload limit is ${maxSizeInMb}MB`)
    this.name = 'Unsupported type'
  }
}
