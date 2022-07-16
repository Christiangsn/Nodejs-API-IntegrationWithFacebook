import { ILoadFacebookUserAPI } from '@data/contracts/facebook'
import { ICreateFacebookAccountRepository, ILoudUserAccountRepository, IUpdatedFacebookAccountRepository } from '@data/contracts/repositories'
import { FacebookAuthenticationUseCases } from '@data/useCases/facebook'
import { TAuthenticationError } from '@domain/error'

import { mock, MockProxy } from 'jest-mock-extended'

describe('FacebookAuthenticationUseCase', () => {
  let facebookAPI: MockProxy<ILoadFacebookUserAPI>
  let userAccountRepository: MockProxy<ILoudUserAccountRepository & ICreateFacebookAccountRepository & IUpdatedFacebookAccountRepository>
  let sut: FacebookAuthenticationUseCases

  const token = 'any_token'

  beforeEach(() => {
    facebookAPI = mock()
    facebookAPI.generation.mockResolvedValue({
      name: 'any_facebook_name',
      email: 'any_facebook_email',
      facebookId: 'any_facebook_id'
    })
    userAccountRepository = mock()
    userAccountRepository.check.mockResolvedValue(undefined)
    sut = new FacebookAuthenticationUseCases(facebookAPI, userAccountRepository)
  })

  it('Should call LoudAccountRepository with correct params', async () => {
    await sut.execute({ token })

    expect(facebookAPI.generation).toHaveBeenCalledWith({ token })
    expect(facebookAPI.generation).toHaveBeenCalledTimes(1)
  })

  it('Should return AuthenticationError when LoudAccountRepository returns undefined', async () => {
    facebookAPI.generation.mockResolvedValueOnce(undefined)

    const authResult = await sut.execute({ token })

    expect(authResult).toEqual(new TAuthenticationError())
  })

  it('Should call loadUserAccountRepository when LoudAccountRepository returns data', async () => {
    await sut.execute({ token })

    expect(userAccountRepository.check).toHaveBeenCalledWith({ email: 'any_facebook_email' })
    expect(userAccountRepository.check).toHaveBeenCalledTimes(1)
  })

  it('Should call CreateFacebookUserAccountRepository when LoudAccountRepository returns undefined', async () => {
    await sut.execute({ token })

    expect(userAccountRepository.createFromFacebook).toHaveBeenCalledWith({
      name: 'any_facebook_name',
      email: 'any_facebook_email',
      facebookId: 'any_facebook_id'
    })
    expect(userAccountRepository.createFromFacebook).toHaveBeenCalledTimes(1)
  })

  it('Should call UpdateFacebookUserAccountRepository when LoudAccountRepository returns data', async () => {
    userAccountRepository.check.mockResolvedValueOnce({
      id: 'any_id',
      name: 'any_name'
    })
    await sut.execute({ token })

    expect(userAccountRepository.updatedWithFacebookData).toHaveBeenCalledWith({
      id: 'any_id',
      name: 'any_name',
      facebookId: 'any_facebook_id'
    })
    expect(userAccountRepository.updatedWithFacebookData).toHaveBeenCalledTimes(1)
  })

  it('Should updated account name', async () => {
    userAccountRepository.check.mockResolvedValueOnce({
      id: 'any_id'
    })
    await sut.execute({ token })

    expect(userAccountRepository.updatedWithFacebookData).toHaveBeenCalledWith({
      id: 'any_id',
      name: 'any_facebook_name',
      facebookId: 'any_facebook_id'
    })
    expect(userAccountRepository.updatedWithFacebookData).toHaveBeenCalledTimes(1)
  })
})
