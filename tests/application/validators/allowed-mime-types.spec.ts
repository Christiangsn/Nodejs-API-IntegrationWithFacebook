import { InvalidMymeTypeError } from '@app/errors/validators/validator.invalid.mime.type'

type Extension = 'png' | 'jpg' | 'jpeg'

class AllowedMimeTypes {
  constructor (
    private readonly allowed: Extension[],
    private readonly mimeType: string
  ) {}

  public validate (): Error | undefined {
    if (this.allowed.includes('png') && this.mimeType !== 'image/png') {
      return new InvalidMymeTypeError(this.allowed)
    }
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
})
