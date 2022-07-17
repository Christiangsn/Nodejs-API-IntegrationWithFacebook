import { IHttpGetClient } from '@infra/http'
import { ILoadFacebookUserAPI } from '@data/contracts/facebook'

type TAppToken = {
  access_token: string
}

type TDebugToken = {
  data: {
    user_id: string
  }
}

type TFaceboookData = {
  id: string
  name: string
  email: string
}

export class FacebookAPI implements ILoadFacebookUserAPI {
  private readonly baseURL = 'https://graph.facebook.com'

  constructor (
    private readonly httpClient: IHttpGetClient,
    private readonly clientID: string,
    private readonly clientSecret: string
  ) { }

  public async generation ({ token }: ILoadFacebookUserAPI.Params): Promise<ILoadFacebookUserAPI.Return> {
    const userInfo = await this.getUserInfo(token)

    return {
      facebookId: userInfo.id,
      name: userInfo.name,
      email: userInfo.email
    }
  }

  private async getAppToken (): Promise<TAppToken> {
    return this.httpClient.get({
      url: `${this.baseURL}/oauth/access_token`,
      params: {
        client_id: this.clientID,
        client_secret: this.clientSecret,
        grand_type: 'client_credentials'
      }
    })
  }

  private async getDebugToken (token: string): Promise<TDebugToken> {
    const appToken = await this.getAppToken()
    return this.httpClient.get({
      url: `${this.baseURL}/debug_token`,
      params: {
        access_token: appToken.access_token,
        input_token: token
      }
    })
  }

  private async getUserInfo (token: string): Promise<TFaceboookData> {
    const debugToken = await this.getDebugToken(token)

    return this.httpClient.get({
      url: `${this.baseURL}/${debugToken.data.user_id}`,
      params: {
        fields: ['id', 'name', 'email'].join(','),
        access_token: token
      }
    })
  }
}
