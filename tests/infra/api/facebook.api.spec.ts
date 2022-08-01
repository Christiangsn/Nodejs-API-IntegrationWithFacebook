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
      .mockResolvedValueOnce({
        id: 'any_facebook_id',
        name: 'any_facebook_name',
        email: 'any_facebook_email'
      })
    sut = new FacebookAPI(httpClient, clientID, clientSecret)
  })

  it('Should get app token', async () => {
    await sut.generation({ token: 'any_client_token' })

    expect(httpClient.get).toHaveBeenCalledWith({
      url: `https://graph.facebook.com/oauth/access_token?grant_type=client_credentials&client_id=${clientID}&client_secret=${clientSecret}`,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  })

  it('Should get debug token', async () => {
    await sut.generation({ token: 'any_client_token' })

    expect(httpClient.get).toHaveBeenCalledWith({
      url: 'https://graph.facebook.com/debug_token?access_token=any_app_token&input_token=any_client_token',
      headers: {
        'Content-Type': 'application/json'
      }
    //   params: {
    //     access_token: 'any_app_token',
    //     input_token: 'any_client_token'
    //   }
    })
  })

  it('Should get user info', async () => {
    await sut.generation({ token: 'any_client_token' })

    expect(httpClient.get).toHaveBeenCalledWith({
      url: 'https://graph.facebook.com/any_user_id?fields=id,name,email&access_token=any_client_token',
      headers: {
        'Content-Type': 'application/json'
      }
    })
  })

  it('Should return facebook user', async () => {
    const facebookUser = await sut.generation({ token: 'any_client_token' })

    expect(facebookUser).toEqual({
      facebookId: 'any_facebook_id',
      name: 'any_facebook_name',
      email: 'any_facebook_email'
    })
  })

  it('Should return undefined if HttpGetCLient throws', async () => {
    httpClient.get.mockReset().mockRejectedValueOnce(new Error('facebook_error'))
    const facebookUser = await sut.generation({ token: 'any_client_token' })

    expect(facebookUser).toBeUndefined()
  })
})
