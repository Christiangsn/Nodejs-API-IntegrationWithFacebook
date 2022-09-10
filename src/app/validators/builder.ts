
import { RequiredString } from './required.string'
import { Validator } from './validator'

export class ValidationBuilder {
  private constructor (
    private readonly value: string,
    private readonly fieldName: string,
    private readonly validators: Validator[] = []
  ) { }

  public static of (params: { value: string, fieldName: string}): ValidationBuilder {
    return new ValidationBuilder(params.value, params.fieldName)
  }

  public required (): ValidationBuilder {
    this.validators.push(new RequiredString(this.value, this.fieldName))
    return this
  }

  public build (): Validator[] {
    return this.validators
  }
}
