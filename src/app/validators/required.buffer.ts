import { RequiredFieldError } from '@app/errors/http'
import { Required } from './required.any'

export class RequiredBuffer extends Required {
  constructor (
    override readonly value: Buffer,
    override readonly fieldName?: string
  ) {
    super(value, fieldName)
  }

  override validate (): Error | undefined {
    if (super.validate() !== undefined || this.value.length === 0) {
      return new RequiredFieldError(this.fieldName)
    }

    return undefined
  }
}
