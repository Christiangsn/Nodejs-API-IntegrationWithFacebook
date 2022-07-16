import { FacebookAccount } from '@domain/models/facebook.model'
import { ILoadFacebookUserAPI } from '@data/contracts/facebook'
import { ITokenGeneration } from '@data/contracts/crypto'
import { ISaveFacebookAccountRepository, ILoudUserAccountRepository } from '@data/contracts/repositories'
import { FacebookAuthenticationUseCases } from '@data/useCases/facebook'
import { TAuthenticationError } from '@domain/error'

import { mock, MockProxy } from 'jest-mock-extended'

jest.mock('@domain/models/facebook.model')

describe('FacebookAuthenticationUseCase', () => {
  let facebookAPI: MockProxy<ILoadFacebookUserAPI>
  let cryptography: MockProxy<ITokenGeneration>
  let userAccountRepository: MockProxy<ILoudUserAccountRepository & ISaveFacebookAccountRepository>
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
    cryptography = mock()
    userAccountRepository.check.mockResolvedValue(undefined)
    userAccountRepository.saveWithFacebook.mockResolvedValueOnce({
      id: '001_ID_ACCOUNT'
    })
    sut = new FacebookAuthenticationUseCases(facebookAPI, userAccountRepository, cryptography)
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

  it('Should call ISaveFacebookAccountRepository with facebook account', async () => {
    // MOckar uma propriedade
    const facebookAccountStub = jest.fn().mockImplementation(() => {
      return {}
    })
    // Reecrever implementação do construtor
    jest.mocked(FacebookAccount).mockImplementation(facebookAccountStub)
    await sut.execute({ token })

    expect(userAccountRepository.saveWithFacebook).toHaveBeenCalledWith({})
    expect(userAccountRepository.saveWithFacebook).toHaveBeenCalledTimes(1)
  })

  it('Should call ITokenGenerator with correct params', async () => {
    await sut.execute({ token })

    expect(cryptography.generation).toHaveBeenCalledWith({
      key: '001_ID_ACCOUNT'
    })

    expect(cryptography.generation).toHaveBeenCalledTimes(1)
  })
})
