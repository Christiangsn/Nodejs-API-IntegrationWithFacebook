import { IHttpGetClient } from '@infra/http'
import { ILoadFacebookUser } from '@domain/contracts/gateways'

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

export class FacebookAPI implements ILoadFacebookUser {
  private readonly baseURL = 'https://graph.facebook.com'

  constructor (
    private readonly httpClient: IHttpGetClient,
    private readonly clientID: string,
    private readonly clientSecret: string
  ) { }

  public async generation ({ token }: ILoadFacebookUser.Params): Promise<ILoadFacebookUser.Return> {
    return new Promise((resolve) => {
      this.getUserInfo(token)
        .then((userInfo) => {
          resolve({
            facebookId: userInfo.id,
            name: userInfo.name,
            email: userInfo.email
          })
        }).catch(() => {
          resolve(undefined)
        })
    })
  }

  private async getAppToken (): Promise<TAppToken> {
    const result = await this.httpClient.get({
      url: `${this.baseURL}/oauth/access_token?grant_type=client_credentials&client_id=${this.clientID}&client_secret=${this.clientSecret}`,
      headers: {
        'Content-Type': 'application/json'
      }
    })
    return result
  }

  private async getDebugToken (token: string): Promise<TDebugToken> {
    const appToken = await this.getAppToken()
    return this.httpClient.get({
      url: `${this.baseURL}/debug_token?access_token=${appToken.access_token}&input_token=${token}`,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }

  private async getUserInfo (token: string): Promise<TFaceboookData> {
    const debugToken = await this.getDebugToken(token)

    const info = await this.httpClient.get({
      url: `${this.baseURL}/${debugToken.data.user_id}?fields=id,name,email&access_token=${token}`,
      headers: {
        'Content-Type': 'application/json'
      }
    })

    return info
  }
}
