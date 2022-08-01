import { FacebookAPI } from '@infra/api'
import { AxiosHttpClient } from '@infra/http'
import { env } from '@main/config/env'

describe('Facebook Apí Integration Tests', () => {
  let axiosClient: AxiosHttpClient
  let sut: FacebookAPI

  beforeEach(() => {
    axiosClient = new AxiosHttpClient()
    sut = new FacebookAPI(axiosClient, env.facebookApi.clientId, env.facebookApi.clientSecret)
  })

  it('Should return a Facebook User if token is valid', async () => {
    // Valido por 3 meses
    const fbUser = await sut.generation({
      token: 'EAAGuLNa9yJYBAOiHrJ9Sj4kkDqtAD6WZAyXqjZBpUZAxNrXdUIkKSFtRhMFFlHgD9YdHWjuKmKOFuH14AXsAl1xTbSba9liLOZBA3gVa6Qde19KXki7Kt7Yd4fks4vzDXHUWKTLhYte4WhvIQ3q5ZBZC0OfRoVQjc0Q2044FEXWzk7cQ9fIDilqgpIMw5y241wBDj4MKnkGMfbknBx45ih'
    })

    expect(fbUser).toEqual({
      name: 'Christian Teste',
      facebookId: '110829771719967',
      email: 'christian_ywqtbro_teste@tfbnw.net'
    })
  })

  it('Should return a undefined if token is invalid', async () => {
    // Valido por 3 meses
    const fbUser = await sut.generation({
      token: 'invalid'
    })

    expect(fbUser).toBeUndefined()
  })
})
