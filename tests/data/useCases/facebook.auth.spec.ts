import { FacebookAuthenticationUseCases } from '@data/useCases/facebook'
import { TAuthenticationError } from '@domain/error'

describe('FacebookAuthenticationUseCase', () => {
  it('Should call LoadFacebookUserAPI with correct params', async () => {
    const loadFacebookUserAPI = {
      generation: jest.fn()
    }
    const sut = new FacebookAuthenticationUseCases(loadFacebookUserAPI)

    await sut.execute({ token: 'any_token' })

    expect(loadFacebookUserAPI.generation).toHaveBeenCalledWith({ token: 'any_token' })
    expect(loadFacebookUserAPI.generation).toHaveBeenCalledTimes(1)
  })

  it('Should return AuthenticationError when LoadFacebookUserAPI returns undefined', async () => {
    const loadFacebookUserAPI = {
      generation: jest.fn()
    }
    loadFacebookUserAPI.generation.mockResolvedValueOnce(undefined)
    const sut = new FacebookAuthenticationUseCases(loadFacebookUserAPI)

    const authResult = await sut.execute({ token: 'any_token' })

    expect(authResult).toEqual(new TAuthenticationError())
  })
})
