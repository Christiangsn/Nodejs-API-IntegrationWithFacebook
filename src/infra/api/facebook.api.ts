/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { IHttpGetClient } from '@infra/http'
import { ILoadFacebookUserAPI } from '@data/contracts/facebook'

export class FacebookAPI {
  private readonly baseURL = 'https://graph.facebook.com'

  constructor (
    private readonly httpClient: IHttpGetClient,
    private readonly clientID: string,
    private readonly clientSecret: string
  ) {}

  async generation ({ token }: ILoadFacebookUserAPI.Params): Promise<void> {
    const appToken = await this.httpClient.get({
      url: `${this.baseURL}/oauth/access_token`,
      params: {
        client_id: this.clientID,
        client_secret: this.clientSecret,
        grand_type: 'client_credentials'
      }
    })

    const debugToken = await this.httpClient.get({
      url: `${this.baseURL}/debug_token`,
      params: {
        access_token: appToken.access_token,
        input_token: token
      }
    })

    await this.httpClient.get({
      url: `${this.baseURL}/${debugToken.data.user_id}`,
      params: {
        fields: ['id', 'name', 'email'].join(','),
        access_token: token
      }
    })
  }
}
