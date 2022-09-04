import { IHttpResponse } from '@app/helpers/http'
import { Fobidden, Success } from '@app/helpers/responses'
import { RequiredStringValidator } from '@app/validators'
import { IAuthorize } from '@domain/features/auth'
import { IMiddleware } from './middleware'

type IHttpRequest = { authorization: string}
type Model = Error | { userId: string }

export class AuthenticationMiddleware implements IMiddleware {
  constructor (
    private readonly authorize: IAuthorize
  ) { }

  public async handle ({ authorization }: IHttpRequest): Promise<IHttpResponse<Model> > {
    if (!this.validate({ authorization })) return Fobidden()

    try {
      const userId = await this.authorize.auth({ token: authorization })
      return Success({ userId })
    } catch (error) {
      return Fobidden()
    }
  }

  private validate ({ authorization }: IHttpRequest): boolean {
    const error = new RequiredStringValidator(authorization, 'authorization').validate()
    return error === undefined
  }
}
