import { FacebookAccount } from '@domain/models/facebook.model'
import { ILoadFacebookUserAPI } from '@domain/contracts/facebook'
import { ITokenGeneration } from '@domain/contracts/crypto'
import { ISaveFacebookAccountRepository, ILoudUserAccountRepository } from '@domain/contracts/repositories'
import { FacebookAuthenticationUseCases } from '@domain/useCases/facebook'
import { TAuthenticationError } from '@domain/error'

import { mock, MockProxy } from 'jest-mock-extended'
import { AccessToken } from '@domain/models'

jest.mock('@domain/models/facebook.model')

describe('FacebookAuthenticationUseCase', () => {
  let facebookAPI: MockProxy<ILoadFacebookUserAPI>
  let cryptography: MockProxy<ITokenGeneration>
  let userAccountRepository: MockProxy<ILoudUserAccountRepository & ISaveFacebookAccountRepository>
  let sut: FacebookAuthenticationUseCases

  const token = 'any_token'

  beforeAll(() => {
    facebookAPI = mock()
    facebookAPI.generation.mockResolvedValue({
      name: 'any_facebook_name',
      email: 'any_facebook_email',
      facebookId: 'any_facebook_id'
    })

    userAccountRepository = mock()
    userAccountRepository.check.mockResolvedValue(undefined)
    userAccountRepository.saveWithFacebook.mockResolvedValue({
      id: '001_ID_ACCOUNT'
    })
    cryptography = mock()
    cryptography.generation.mockResolvedValue('ANY_TOKEN_0001')
  })

  beforeEach(() => {
    jest.clearAllMocks()

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
      key: '001_ID_ACCOUNT',
      expirationInMs: AccessToken.expirationInMs
    })

    expect(cryptography.generation).toHaveBeenCalledTimes(1)
  })

  it('Should return an AccessTOken on sucess', async () => {
    const authResult = await sut.execute({ token })

    expect(authResult).toEqual(new AccessToken('ANY_TOKEN_0001'))
  })

  it('Should rethrow if ILoadFacebookUserAPI throws', async () => {
    facebookAPI.generation.mockRejectedValueOnce(new Error('Facebook Error'))
    const promise = sut.execute({ token })

    await expect(promise).rejects.toThrow(new Error('Facebook Error'))
  })

  it('Should rethrow if ILoudUserAccountRepository throws', async () => {
    userAccountRepository.check.mockRejectedValueOnce(new Error('Error in search user'))
    const promise = sut.execute({ token })

    await expect(promise).rejects.toThrow(new Error('Error in search user'))
  })

  it('Should rethrow if ISaveFacebookAccountRepository throws', async () => {
    userAccountRepository.saveWithFacebook.mockRejectedValueOnce(new Error('Failed in save user'))

    const promise = sut.execute({ token })

    await expect(promise).rejects.toThrow(new Error('Failed in save user'))
  })

  it('Should rethrow if ITokenGeneration throws', async () => {
    cryptography.generation.mockRejectedValueOnce(new Error('Failed in generation token'))
    const promise = sut.execute({ token })

    await expect(promise).rejects.toThrow(new Error('Failed in generation token'))
  })
})
