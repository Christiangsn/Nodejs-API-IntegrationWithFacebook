import { MaxFileSizeError } from './../../errors/validators/validator.max.file.size'
export class MaxFileSize {
  private readonly maxFileSizeInByes: number

  constructor (
    private readonly maxSizeInMb: number,
    private readonly value: Buffer
  ) {
    this.maxFileSizeInByes = 5 * 1024 * 1024
  }

  public validate (): Error | undefined {
    if (this.value.length > this.maxFileSizeInByes) {
      return new MaxFileSizeError(this.maxSizeInMb)
    }

    return undefined
  }
}
