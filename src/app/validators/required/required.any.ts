import { RequiredFieldError } from '@app/errors/http'
import { Validator } from '../contracts/validator'

export class Required implements Validator {
  constructor (
    public readonly value: any,
    public readonly fieldName?: string
  ) {}

  public validate (): Error | undefined {
    if (this.value === null || this.value === undefined) {
      return new RequiredFieldError(this.fieldName)
    }

    return undefined
  }
}
