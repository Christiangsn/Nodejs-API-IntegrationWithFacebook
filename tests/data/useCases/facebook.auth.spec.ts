import { ILoadFacebookUserAPI } from '@data/contracts'
import { FacebookAuthenticationUseCases } from '@data/useCases/facebook'
import { TAuthenticationError } from '@domain/error'

import { mock } from 'jest-mock-extended'

describe('FacebookAuthenticationUseCase', () => {
  it('Should call LoadFacebookUserAPI with correct params', async () => {
    const loadFacebookUserAPI = mock<ILoadFacebookUserAPI>()
    const sut = new FacebookAuthenticationUseCases(loadFacebookUserAPI)

    await sut.execute({ token: 'any_token' })

    expect(loadFacebookUserAPI.generation).toHaveBeenCalledWith({ token: 'any_token' })
    expect(loadFacebookUserAPI.generation).toHaveBeenCalledTimes(1)
  })

  it('Should return AuthenticationError when LoadFacebookUserAPI returns undefined', async () => {
    const loadFacebookUserAPI = mock<ILoadFacebookUserAPI>()

    loadFacebookUserAPI.generation.mockResolvedValueOnce(undefined)
    const sut = new FacebookAuthenticationUseCases(loadFacebookUserAPI)

    const authResult = await sut.execute({ token: 'any_token' })

    expect(authResult).toEqual(new TAuthenticationError())
  })
})
