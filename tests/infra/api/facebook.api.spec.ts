import { FacebookAPI } from '@infra/api'
import { IHttpGetClient } from '@infra/http'

import { mock, MockProxy } from 'jest-mock-extended'

describe('FacebookAPI', () => {
  let clientID: string
  let clientSecret: string
  let sut: FacebookAPI
  let httpClient: MockProxy<IHttpGetClient>

  beforeAll(() => {
    clientID = 'any_client_id'
    clientSecret = 'any_client_secret'
    httpClient = mock<IHttpGetClient>()
  })

  beforeEach(() => {
    jest.clearAllMocks()
    httpClient.get
      .mockResolvedValueOnce({
        access_token: 'any_app_token'
      })
      .mockResolvedValueOnce({
        data: {
          user_id: 'any_user_id'
        }
      })
    sut = new FacebookAPI(httpClient, clientID, clientSecret)
  })

  it('Should get app token', async () => {
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

  it('Should get debug token', async () => {
    await sut.generation({ token: 'any_client_token' })

    expect(httpClient.get).toHaveBeenCalledWith({
      url: 'https://graph.facebook.com/debug_token',
      params: {
        access_token: 'any_app_token',
        input_token: 'any_client_token'
      }
    })
  })

  it('Should get user info', async () => {
    await sut.generation({ token: 'any_client_token' })

    expect(httpClient.get).toHaveBeenCalledWith({
      url: 'https://graph.facebook.com/any_user_id',
      params: {
        fields: 'id,name,email',
        access_token: 'any_client_token'
      }
    })
  })
})
