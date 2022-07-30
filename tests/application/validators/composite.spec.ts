import { MockProxy, mock } from 'jest-mock-extended'
/* eslint-disable @typescript-eslint/no-unused-vars */

interface Validator {
  validate: () => Error | undefined
}

class ValidationComposite implements Validator {
  constructor (
    private readonly validators: Validator[]
  ) {}

  public validate (): Error | undefined {
    for (const validator of this.validators) {
      const error = validator.validate()
      if (error !== undefined) {
        return error
      }
    }
  }
}

describe('ValidationComposite', () => {
  let sut: ValidationComposite
  let validators1: MockProxy<Validator>

  let validators2: MockProxy<Validator>
  let validators: Validator[]

  beforeAll(() => {
    validators1 = mock<Validator>()
    validators1.validate.mockReturnValue(undefined)
    validators2 = mock<Validator>()
    validators2.validate.mockReturnValue(undefined)
    validators = [validators1, validators2]
  })

  beforeEach(() => {
    sut = new ValidationComposite(validators)
  })

  it('Should return undefined if all Validators returns undefined', () => {
    const error = sut.validate()

    expect(error).toBeUndefined()
  })

  it('Should return the first error', () => {
    validators1.validate.mockReturnValueOnce(new Error('error_1'))
    validators2.validate.mockReturnValueOnce(new Error('error_2'))

    const error = sut.validate()

    expect(error).toEqual(new Error('error_1'))
  })

  it('Should return the second error', () => {
    validators2.validate.mockReturnValueOnce(new Error('error_2'))

    const error = sut.validate()

    expect(error).toEqual(new Error('error_2'))
  })
})
