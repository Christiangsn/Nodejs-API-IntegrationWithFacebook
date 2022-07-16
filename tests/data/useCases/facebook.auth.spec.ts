import { ILoadFacebookUserAPI } from '@data/contracts/facebook'
import { IFacebookAuth } from '@domain/contracts'
// import { TAuthenticationError } from '@domain/error'

class FacebookAuthenticationUseCases {
  constructor (
    private readonly loadFacebookUseByTokenAPI: ILoadFacebookUserAPI
  ) {}

  public async execute ({ token }: IFacebookAuth.Params): Promise<Error> {
    await this.loadFacebookUseByTokenAPI.generation({ token })
    return new Error()
  }
}

class LoadFacebookUserAPISpy implements ILoadFacebookUserAPI {
  public token?: string
  public return: undefined = undefined

  public async generation ({ token }: ILoadFacebookUserAPI.Params): Promise<ILoadFacebookUserAPI.Return> {
    this.token = token
    return this.return
  }
}

describe('FacebookAuthenticationUseCase', () => {
  it('Should call LoadFacebookUserAPI with correct params', async () => {
    const loadFacebookUserAPI = new LoadFacebookUserAPISpy()
    const sut = new FacebookAuthenticationUseCases(loadFacebookUserAPI)

    await sut.execute({ token: 'any_token' })

    expect(loadFacebookUserAPI.token).toBe('any_token')
  })

  it('Should return AuthenticationError when LoadFacebookUserAPI returns undefined', async () => {
    const loadFacebookUserAPI = new LoadFacebookUserAPISpy()
    loadFacebookUserAPI.return = undefined
    const sut = new FacebookAuthenticationUseCases(loadFacebookUserAPI)

    const authResult = await sut.execute({ token: 'any_token' })

    expect(authResult).toEqual(new Error())
  })
})
