import { RequiredFieldError } from '@app/errors/http'
import { Required } from '@app/validators'

describe('Required', () => {
  it('Should return RequiredFieldError if value is null', () => {
    const sut = new Required(null as any, 'any_field')

    const error = sut.validate()
    expect(error).toEqual(new RequiredFieldError('any_field'))
  })

  it('Should return RequiredFieldError if value is undefined', () => {
    const sut = new Required(undefined as any, 'any_field')

    const error = sut.validate()
    expect(error).toEqual(new RequiredFieldError('any_field'))
  })

  it('Should return undefined if value is not undefined', () => {
    const sut = new Required('anuy_value', 'any_field')

    const error = sut.validate()
    expect(error).toBeUndefined()
  })
})
