import { ILoadFacebookUserAPI } from '@data/contracts/facebook'
import { mock } from 'jest-mock-extended'

class FacebookAPI {
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

interface IHttpGetClient {
  get: (params: IHttpGetClient.Params) => Promise<void>
}

namespace IHttpGetClient {
  export type Params = {
    url: string
    params: {
      client_id: string
      client_secret: string
      grand_type: string
    }
  }
}

describe('FacebookAPI', () => {
  const clientID = 'any_client_id'
  const clientSecret = 'any_client_secret'

  it('Should get app token', async () => {
    const httpClient = mock<IHttpGetClient>()
    const sut = new FacebookAPI(httpClient, clientID, clientSecret)

    await sut.generation({ token: 'any_client_token' })

    expect(httpClient.get).toHaveBeenCalledWith({
      url: 'https://graph.facebook.com/oauth/access_token',
      params: {
        client_id: clientID,
        client_secret: clientSecret,
        grand_type: 'client_credentials'
      }
    })
  })
})
