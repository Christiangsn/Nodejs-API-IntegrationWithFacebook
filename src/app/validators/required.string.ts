import { RequiredFieldError } from '@app/errors/http'

export class RequiredStringValidator {
  constructor (
    private readonly value: string,
    private readonly fieldName: string
  ) {}

  public validate (): Error | undefined {
    if (this.value === '' || this.value === null || this.value === undefined) {
      return new RequiredFieldError(this.fieldName)
    }

    return undefined
  }
}
