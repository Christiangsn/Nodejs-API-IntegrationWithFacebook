/* eslint-disable @typescript-eslint/no-unused-vars */
import { InvalidMymeTypeError } from '@app/errors/validators/validator.invalid.mime.type'

type Extension = 'png' | 'jpg' | 'jpeg'

class AllowedMimeTypes {
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

describe('AllowedMimeTypes', () => {
  it('Should return InvalidMymeTypeError if value is invalid', () => {
    const sut = new AllowedMimeTypes(['png'], 'image/gif')
    const error = sut.validate()

    expect(error).toEqual(new InvalidMymeTypeError(['png']))
  })

  it('Should return undefined if value is valid', () => {
    const sut = new AllowedMimeTypes(['png'], 'image/png')
    const error = sut.validate()

    expect(error).toBeUndefined()
  })

  it('Should return undefined if value is valid', () => {
    const sut = new AllowedMimeTypes(['jpg'], 'image/jpg')
    const error = sut.validate()

    expect(error).toBeUndefined()
  })

  it('Should return undefined if value is valid', () => {
    const sut = new AllowedMimeTypes(['jpg'], 'image/jpeg')
    const error = sut.validate()

    expect(error).toBeUndefined()
  })
})
