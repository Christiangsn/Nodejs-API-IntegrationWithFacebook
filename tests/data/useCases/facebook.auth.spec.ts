import { ILoadFacebookUserAPI } from '@data/contracts/facebook'
import { ICreateFacebookAccountRepository, ILoudUserAccountRepository } from '@data/contracts/repositories'
import { FacebookAuthenticationUseCases } from '@data/useCases/facebook'
import { TAuthenticationError } from '@domain/error'

import { mock, MockProxy } from 'jest-mock-extended'

describe('FacebookAuthenticationUseCase', () => {
  let loadFacebookUserAPI: MockProxy<ILoadFacebookUserAPI>
  let loadUserAccountRepository: MockProxy<ILoudUserAccountRepository>
  let createFacebookAccountRepository: MockProxy<ICreateFacebookAccountRepository>
  let sut: FacebookAuthenticationUseCases

  const token = 'any_token'

  beforeEach(() => {
    loadFacebookUserAPI = mock()
    createFacebookAccountRepository = mock()
    loadFacebookUserAPI.generation.mockResolvedValue({
      name: 'any_facebook_name',
      email: 'any_facebook_email',
      facebookId: 'any_facebook_id'
    })
    loadUserAccountRepository = mock()
    sut = new FacebookAuthenticationUseCases(loadFacebookUserAPI, loadUserAccountRepository, createFacebookAccountRepository)
  })

  it('Should call LoadFacebookUserAPI with correct params', async () => {
    await sut.execute({ token })

    expect(loadFacebookUserAPI.generation).toHaveBeenCalledWith({ token })
    expect(loadFacebookUserAPI.generation).toHaveBeenCalledTimes(1)
  })

  it('Should return AuthenticationError when LoadFacebookUserAPI returns undefined', async () => {
    loadFacebookUserAPI.generation.mockResolvedValueOnce(undefined)

    const authResult = await sut.execute({ token })

    expect(authResult).toEqual(new TAuthenticationError())
  })

  it('Should call loadUserAccountRepository when LoadFacebookUserAPI returns data', async () => {
    await sut.execute({ token })

    expect(loadUserAccountRepository.check).toHaveBeenCalledWith({ email: 'any_facebook_email' })
    expect(loadUserAccountRepository.check).toHaveBeenCalledTimes(1)
  })

  it('Should call CreateUserAccountRepository when LoadFacebookUserAPI returns undefined', async () => {
    loadUserAccountRepository.check.mockResolvedValueOnce(undefined)
    await sut.execute({ token })

    expect(createFacebookAccountRepository.createFromFacebook).toHaveBeenCalledWith({
      name: 'any_facebook_name',
      email: 'any_facebook_email',
      facebookId: 'any_facebook_id'
    })
    expect(createFacebookAccountRepository.createFromFacebook).toHaveBeenCalledTimes(1)
  })
})
