import { ILoadFacebookUserAPI } from '@data/contracts/facebook'
import { mock } from 'jest-mock-extended'

class FacebookAPI {
  private readonly baseURL = 'https://graph.facebook.com'

  constructor (
    private readonly httpClient: IHttpGetClient
  ) {}

  async generation ({ token }: ILoadFacebookUserAPI.Params): Promise<void> {
    await this.httpClient.get({
      url: `${this.baseURL}/oauth/access_token`
    })
  }
}

interface IHttpGetClient {
  get: (params: IHttpGetClient.Params) => Promise<void>
}

namespace IHttpGetClient {
  export type Params = {
    url: string
  }
}

describe('FacebookAPI', () => {
  it('Should get app token', async () => {
    const httpClient = mock<IHttpGetClient>()
    const sut = new FacebookAPI(httpClient)

    await sut.generation({ token: 'any_client_token' })

    expect(httpClient.get).toHaveBeenCalledWith({
      url: 'https://graph.facebook.com/oauth/access_token'
    })
  })
})
