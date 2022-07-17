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
    await this.httpClient.get({
      url: `${this.baseURL}/oauth/access_token`,
      params: {
        client_id: this.clientID,
        client_secret: this.clientSecret,
        grand_type: 'client_credentials'
      }
    })
  }
}
