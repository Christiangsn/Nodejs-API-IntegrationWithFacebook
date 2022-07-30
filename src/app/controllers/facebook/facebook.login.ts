import { RequiredFieldError } from '@app/errors'
import { IHttpResponse } from '@app/helpers/http'
import { BadRequest, Success, InternalServerError } from '@app/helpers/responses'
import { Anauthorized } from '@app/helpers/responses/unauthorized'
import { IFacebookAuth } from '@domain/contracts'
import { AccessToken } from '@domain/models'

type IHttpRequest = {
  token: string
}

type Model = Error | {
  accessToken: string
}

export class FacebookLoginController {
  constructor (
    private readonly facebookAuthenticationUseCases: IFacebookAuth
  ) {}

  public async run (httpRequest: IHttpRequest): Promise<IHttpResponse<Model>> {
    try {
      const error = this.validate(httpRequest)
      if (error) {
        return BadRequest(error)
      }
      // Retorno do result pode ser o token ou um erro
      const accessToken = await this.facebookAuthenticationUseCases.execute({ token: httpRequest.token })

      // Ser for uma instance de um token liberar acesso
      if (accessToken instanceof AccessToken) {
        return Success({
          accessToken: accessToken.value
        })
      }

      // Default caso não conseguir processar as regras de cima como erro
      return Anauthorized()
    } catch (err) {
      return InternalServerError(err as Error)
    }
  }

  private validate (httpRequest: IHttpRequest): Error | null {
    if (httpRequest.token === '' || httpRequest.token === null || httpRequest.token === undefined) {
      return new RequiredFieldError('token')
    }

    return null
  }
}
