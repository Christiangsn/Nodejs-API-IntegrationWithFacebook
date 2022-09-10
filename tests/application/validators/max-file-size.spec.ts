import { MaxFileSizeError } from './../../../src/app/errors/validators/validator.max.file.size'
import { MaxFileSize } from '@app/validators'

describe('AllowedMimeTypes', () => {
  it('Should return InvalidMymeTypeError if value is invalid', () => {
    const invalidBuffer = Buffer.from(new ArrayBuffer(6 * 1024 * 1024))
    const sut = new MaxFileSize(5, invalidBuffer)
    const error = sut.validate()

    expect(error).toEqual(new MaxFileSizeError(5))
  })

  it('Should return undefined if value is valid', () => {
    const validBuffer = Buffer.from(new ArrayBuffer(4 * 1024 * 1024))
    const sut = new MaxFileSize(5, validBuffer)

    const error = sut.validate()

    expect(error).toBeUndefined()
  })

  it('Should return undefined if value is valid', () => {
    const validBuffer = Buffer.from(new ArrayBuffer(5 * 1024 * 1024))
    const sut = new MaxFileSize(5, validBuffer)

    const error = sut.validate()

    expect(error).toBeUndefined()
  })
})
