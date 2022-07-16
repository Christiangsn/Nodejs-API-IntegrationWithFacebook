import { ILoadFacebookUserAPI } from '@data/contracts'
import { FacebookAuthenticationUseCases } from '@data/useCases/facebook'
import { TAuthenticationError } from '@domain/error'

import { mock, MockProxy } from 'jest-mock-extended'

describe('FacebookAuthenticationUseCase', () => {
  let loadFacebookUserAPI: MockProxy<ILoadFacebookUserAPI>
  let sut: FacebookAuthenticationUseCases

  beforeEach(() => {
    loadFacebookUserAPI = mock()
    sut = new FacebookAuthenticationUseCases(loadFacebookUserAPI)
  })

  it('Should call LoadFacebookUserAPI with correct params', async () => {
    await sut.execute({ token: 'any_token' })

    expect(loadFacebookUserAPI.generation).toHaveBeenCalledWith({ token: 'any_token' })
    expect(loadFacebookUserAPI.generation).toHaveBeenCalledTimes(1)
  })

  it('Should return AuthenticationError when LoadFacebookUserAPI returns undefined', async () => {
    loadFacebookUserAPI.generation.mockResolvedValueOnce(undefined)

    const authResult = await sut.execute({ token: 'any_token' })

    expect(authResult).toEqual(new TAuthenticationError())
  })
})
