import { MaxFileSize } from './../required/max-file-size'
import { AllowedMimeTypes } from './../required/allowed-mime-types'
import { Required, RequiredBuffer, RequiredString } from '@app/validators'

import { Validator } from '../contracts/validator'
import { ExtensionTypeImage } from '../contracts/extensions'

export class ValidationBuilder {
  private constructor (
    private readonly value: any,
    private readonly fieldName?: string,
    private readonly validators: Validator[] = []
  ) { }

  public static of (params: { value: any, fieldName?: string}): ValidationBuilder {
    return new ValidationBuilder(params.value, params.fieldName)
  }

  public required (): ValidationBuilder {
    if (this.value instanceof Buffer) {
      this.validators.push(new RequiredBuffer(this.value, this.fieldName))
    } else if (typeof this.value === 'string') {
      this.validators.push(new RequiredString(this.value, this.fieldName))
    } else if (typeof this.value === 'object') {
      this.validators.push(new Required(this.value, this.fieldName))

      if (this.value.buffer !== undefined) {
        this.validators.push(new RequiredBuffer(this.value.buffer, this.fieldName))
      }
    }
    return this
  }

  public image ({ allowed, maxSizeInMb }: { allowed: ExtensionTypeImage[], maxSizeInMb: number}): ValidationBuilder {
    if (this.value.mimeType !== undefined) {
      this.validators.push(new AllowedMimeTypes(allowed, this.value.mimeType))
    }
    if (this.value.buffer !== undefined) {
      this.validators.push(new MaxFileSize(maxSizeInMb, this.value.buffer))
    }
    return this
  }

  public build (): Validator[] {
    return this.validators
  }
}
