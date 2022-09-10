import { RequiredFieldError } from '@app/errors'
import { Required, RequiredBuffer } from '@app/validators'

describe('RequiredBuffer', () => {
  it('Should return RequiredFieldError if value is empty', () => {
    const sut = new RequiredBuffer(Buffer.from(''))

    const error = sut.validate()
    expect(error).toEqual(new RequiredFieldError())
  })

  it('Should return undefined if value is not undefined', () => {
    const sut = new RequiredBuffer(Buffer.from('any_buffer'))

    const error = sut.validate()
    expect(error).toBeUndefined()
  })

  it('Should extends Required', () => {
    const sut = new RequiredBuffer('')

    expect(sut).toBeInstanceOf(Required)
  })
})
