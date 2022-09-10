import { InvalidMymeTypeError } from '@app/errors'

type Extension = 'png' | 'jpg' | 'jpeg'

export class AllowedMimeTypes {
  constructor (
    private readonly allowed: Extension[],
    private readonly mimeType: string
  ) {}

  public validate (): Error | undefined {
    let isValid: boolean = false

    if (this.isPng()) isValid = true
    if (this.isJpg()) isValid = true
    if (!isValid) return new InvalidMymeTypeError(this.allowed)
  }

  private isPng (): boolean {
    return this.allowed.includes('png') && this.mimeType === 'image/png'
  }

  private isJpg (): boolean {
    return this.allowed.includes('jpg') && /image\/jpe?g/.test(this.mimeType)
  }
}
