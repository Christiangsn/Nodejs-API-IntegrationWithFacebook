/* eslint-disable @typescript-eslint/no-unused-vars */
import { InvalidMymeTypeError } from '@app/errors/validators/validator.invalid.mime.type'
import { AllowedMimeTypes } from '@app/validators'

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
