import { ILoadFacebookUserAPI } from '@data/contracts/facebook'
import { FacebookAuthenticationUseCases } from '@data/useCases/facebook'
import { TAuthenticationError } from '@domain/error'

class LoadFacebookUserAPISpy implements ILoadFacebookUserAPI {
  public token?: string
  public callsCount: number = 0
  public return: undefined = undefined

  public async generation ({ token }: ILoadFacebookUserAPI.Params): Promise<ILoadFacebookUserAPI.Return> {
    this.token = token
    this.callsCount++
    return this.return
  }
}

describe('FacebookAuthenticationUseCase', () => {
  it('Should call LoadFacebookUserAPI with correct params', async () => {
    const loadFacebookUserAPI = new LoadFacebookUserAPISpy()
    const sut = new FacebookAuthenticationUseCases(loadFacebookUserAPI)

    await sut.execute({ token: 'any_token' })

    expect(loadFacebookUserAPI.token).toBe('any_token')
    expect(loadFacebookUserAPI.callsCount).toBe(1)
  })

  it('Should return AuthenticationError when LoadFacebookUserAPI returns undefined', async () => {
    const loadFacebookUserAPI = new LoadFacebookUserAPISpy()
    loadFacebookUserAPI.return = undefined
    const sut = new FacebookAuthenticationUseCases(loadFacebookUserAPI)

    const authResult = await sut.execute({ token: 'any_token' })

    expect(authResult).toEqual(new TAuthenticationError())
  })
})
