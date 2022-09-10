import { RequiredFieldError } from '@app/errors/http'
import { Required } from '@app/validators'
import { RequiredString } from '@app/validators/required/required.string'

describe('RequiredString', () => {
  it('Should return RequiredFieldError if value is empty', () => {
    const sut = new RequiredString('', 'any_field')

    const error = sut.validate()
    expect(error).toEqual(new RequiredFieldError('any_field'))
  })

  it('Should return undefined if value is not undefined', () => {
    const sut = new RequiredString('anuy_value', 'any_field')

    const error = sut.validate()
    expect(error).toBeUndefined()
  })

  it('Should extends Required', () => {
    const sut = new RequiredString('')

    expect(sut).toBeInstanceOf(Required)
  })
})
