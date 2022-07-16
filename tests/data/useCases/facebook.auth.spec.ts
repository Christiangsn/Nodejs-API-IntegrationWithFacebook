import { ILoadFacebookUserAPI } from '@data/contracts'
import { FacebookAuthenticationUseCases } from '@data/useCases/facebook'
import { TAuthenticationError } from '@domain/error'

import { mock, MockProxy } from 'jest-mock-extended'

type TSut = {
  sut: FacebookAuthenticationUseCases
  loadFacebookUserAPI: MockProxy<ILoadFacebookUserAPI>
}

const makeSut = (): TSut => {
  const loadFacebookUserAPI = mock<ILoadFacebookUserAPI>()
  const sut = new FacebookAuthenticationUseCases(loadFacebookUserAPI)

  return {
    sut,
    loadFacebookUserAPI
  }
}

describe('FacebookAuthenticationUseCase', () => {
  it('Should call LoadFacebookUserAPI with correct params', async () => {
    const { sut, loadFacebookUserAPI } = makeSut()
    await sut.execute({ token: 'any_token' })

    expect(loadFacebookUserAPI.generation).toHaveBeenCalledWith({ token: 'any_token' })
    expect(loadFacebookUserAPI.generation).toHaveBeenCalledTimes(1)
  })

  it('Should return AuthenticationError when LoadFacebookUserAPI returns undefined', async () => {
    const { sut, loadFacebookUserAPI } = makeSut()

    loadFacebookUserAPI.generation.mockResolvedValueOnce(undefined)

    const authResult = await sut.execute({ token: 'any_token' })

    expect(authResult).toEqual(new TAuthenticationError())
  })
})
