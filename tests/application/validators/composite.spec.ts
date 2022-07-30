import { mock } from 'jest-mock-extended'

interface Validator {
  validate: () => Error | null
}

class ValidationComposite {
  constructor (
    private readonly validators: Validator[]
  ) {}

  public validate (): null {
    return null
  }
}

describe('ValidationComposite', () => {
  it('Should return undefined if all Validators returns undefined', () => {
    const validators1 = mock<Validator>()
    validators1.validate.mockReturnValue(null)

    const validators2 = mock<Validator>()
    validators2.validate.mockReturnValue(null)

    const validators = [validators1, validators2]

    const sut = new ValidationComposite(validators)
    const error = sut.validate()

    expect(error).toBeNull()
  })
})
