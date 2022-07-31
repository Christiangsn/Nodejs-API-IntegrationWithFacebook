import { IHttpResponse } from '@app/helpers/http'
import { BadRequest, InternalServerError } from '@app/helpers/responses'
import { ValidationComposite, Validator } from '@app/validators'

export abstract class Controller {
  public abstract execute (httpRequest: any): Promise<IHttpResponse>

  public builderValidators (httpRequest: any): Validator[] {
    return []
  }

  public async run (httpRequest: any): Promise<IHttpResponse> {
    const error = this.validate(httpRequest)
    if (error !== undefined) {
      return BadRequest(error)
    }

    try {
      return await this.execute(httpRequest)
    } catch (err) {
      return InternalServerError(err as Error)
    }
  }

  private validate (httpRequest: any): Error | undefined {
    const validators = this.builderValidators(httpRequest)
    return new ValidationComposite(validators).validate()
  }
}
