import { RequiredFieldError } from '@app/errors'
import { RequiredStringValidator } from '@app/validators'

describe('RequiredStringValidator', () => {
  it('Should return RequiredFieldError if value is empty', () => {
    const sut = new RequiredStringValidator('', 'any_field')

    const error = sut.validateString()
    expect(error).toEqual(new RequiredFieldError('any_field'))
  })

  it('Should return RequiredFieldError if value is null', () => {
    const sut = new RequiredStringValidator(null as any, 'any_field')

    const error = sut.validateString()
    expect(error).toEqual(new RequiredFieldError('any_field'))
  })

  it('Should return RequiredFieldError if value is undefined', () => {
    const sut = new RequiredStringValidator(undefined as any, 'any_field')

    const error = sut.validateString()
    expect(error).toEqual(new RequiredFieldError('any_field'))
  })

  it('Should return undefined if value is not undefined', () => {
    const sut = new RequiredStringValidator('anuy_value', 'any_field')

    const error = sut.validateString()
    expect(error).toBeNull()
  })
})
