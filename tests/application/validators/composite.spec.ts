import { MockProxy, mock } from 'jest-mock-extended'
/* eslint-disable @typescript-eslint/no-unused-vars */

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
  let sut: ValidationComposite
  let validators1: MockProxy<Validator>

  let validators2: MockProxy<Validator>
  let validators: Validator[]

  beforeAll(() => {
    validators1 = mock<Validator>()
    validators1.validate.mockReturnValue(null)
    validators2 = mock<Validator>()
    validators2.validate.mockReturnValue(null)
    validators = [validators1, validators2]
  })

  beforeEach(() => {
    sut = new ValidationComposite(validators)
  })

  it('Should return undefined if all Validators returns undefined', () => {
    const error = sut.validate()

    expect(error).toBeNull()
  })
})
