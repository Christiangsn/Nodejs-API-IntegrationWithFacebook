import { InvalidMymeTypeError } from '@app/errors/validators/validator.invalid.mime.type'

type Extension = 'png' | 'jpg' | 'jpeg'

class AllowedMimeTypes {
  constructor (
    private readonly allowed: Extension[],
    private readonly mimeType: string
  ) {}

  public validate (): Error {
    return new InvalidMymeTypeError(this.allowed)
  }
}

describe('AllowedMimeTypes', () => {
  it('Should return InvalidMymeTypeError if value is invalid', () => {
    const sut = new AllowedMimeTypes(['png'], 'image/gif')
    const error = sut.validate()

    expect(error).toEqual(new InvalidMymeTypeError(['png']))
  })
})
