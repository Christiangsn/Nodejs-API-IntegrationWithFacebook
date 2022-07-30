import { RequiredFieldError } from '@app/errors'
import { IHttpResponse } from '@app/helpers/http'
import { BadRequest } from '@app/helpers/responses'
import { InternalServerError } from '@app/helpers/responses/server.error'
import { Anauthorized } from '@app/helpers/responses/unauthorized'
import { IFacebookAuth } from '@domain/contracts'
import { AccessToken } from '@domain/models'

export class FacebookLoginController {
  constructor (
    private readonly facebookAuthenticationUseCases: IFacebookAuth
  ) {}

  public async run (httpRequest: any): Promise<IHttpResponse> {
    try {
      if (httpRequest.token === '' || httpRequest.token === null || httpRequest.token === undefined) {
        return BadRequest(new RequiredFieldError('token'))
      }

      // Retorno do result pode ser o token ou um erro
      const accessToken = await this.facebookAuthenticationUseCases.execute({ token: httpRequest.token })

      // Ser for uma instance de um token liberar acesso
      if (accessToken instanceof AccessToken) {
        return {
          statusCode: 200,
          data: {
            acessToken: accessToken.value
          }
        }
      }

      // Default caso não conseguir processar as regras de cima como erro
      return Anauthorized()
    } catch (err) {
      return InternalServerError(err as Error)
    }
  }
}
