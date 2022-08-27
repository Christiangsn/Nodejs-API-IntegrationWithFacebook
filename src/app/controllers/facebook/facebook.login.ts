import { IHttpResponse } from '@app/helpers/http'
import { Success } from '@app/helpers/responses'
import { Anauthorized } from '@app/helpers/responses/unauthorized'
import { ValidationBuilder, Validator } from '@app/validators'
import { IFacebookAuth } from '@domain/features'
import { AccessToken } from '@domain/entities'
import { Controller } from '../controller'

type IHttpRequest = {
  token: string
}

type Model = Error | {
  accessToken: string
}

export class FacebookLoginController extends Controller {
  constructor (
    private readonly facebookAuthenticationUseCases: IFacebookAuth
  ) {
    super()
  }

  public async execute ({ token }: IHttpRequest): Promise<IHttpResponse<Model>> {
    // Retorno do result pode ser o token ou um erro
    const accessToken = await this.facebookAuthenticationUseCases.execute({ token })

    // Ser for uma instance de um token liberar acesso
    if (accessToken instanceof AccessToken) {
      return Success({
        accessToken: accessToken.value
      })
    }

    // Default caso não conseguir processar as regras de cima como erro
    return Anauthorized()
  }

  override builderValidators ({ token }: IHttpRequest): Validator[] {
    const validators = [...ValidationBuilder.of({ value: token, fieldName: 'token' }).required().build()]

    return validators
  }
}
