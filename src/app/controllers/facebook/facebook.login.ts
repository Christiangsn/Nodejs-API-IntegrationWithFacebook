import { ServerError } from '@app/errors'
import { IHttpResponse } from '@app/helpers/http'
import { IFacebookAuth } from '@domain/contracts'
import { AccessToken } from '@domain/models'

export class FacebookLoginController {
  constructor (
    private readonly facebookAuthenticationUseCases: IFacebookAuth
  ) {}

  public async run (httpRequest: any): Promise<IHttpResponse> {
    try {
      if (httpRequest.token === '' || httpRequest.token === null || httpRequest.token === undefined) {
        return {
          statusCode: 400,
          data: new Error('The field token is required')
        }
      }

      // Retorno do result pode ser o token ou um erro
      const result = await this.facebookAuthenticationUseCases.execute({ token: httpRequest.token })

      // Ser for uma instance de um token liberar acesso
      if (result instanceof AccessToken) {
        return {
          statusCode: 200,
          data: {
            acessToken: result.value
          }
        }
      }

      // Default caso não conseguir processar as regras de cima como erro
      return {
        statusCode: 401,
        data: result
      }
    } catch (err) {
      return {
        statusCode: 500,
        data: new ServerError(err as Error)
      }
    }
  }
}
