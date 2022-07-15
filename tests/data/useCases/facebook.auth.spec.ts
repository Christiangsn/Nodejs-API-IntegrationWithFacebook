import { IFacebookAuth } from '@domain/contracts/'

class FacebookAuthenticationUseCases {
  constructor (
    private readonly loadFacebookUseByTokenAPI: ILoadFacebookUserAPI
  ) {}

  public async execute ({ token }: IFacebookAuth.Params): Promise<void> {
    await this.loadFacebookUseByTokenAPI.generation({ token })
  }
}

interface ILoadFacebookUserAPI {
  generation: ({ token }: ILoadFacebookUserAPI.Params) => Promise<void>
}

namespace ILoadFacebookUserAPI {
  export type Params = {
    token: string
  }
}

class LoadFacebookUserAPISpy implements ILoadFacebookUserAPI {
  public token?: string

  public async generation ({ token }: ILoadFacebookUserAPI.Params): Promise<void> {
    this.token = token
  }
}

describe('FacebookAuthenticationUseCase', () => {
  it('Should call LoadFacebookUserAPI with correct params', async () => {
    const loadFacebookUserAPI = new LoadFacebookUserAPISpy()
    const sut = new FacebookAuthenticationUseCases(loadFacebookUserAPI)

    await sut.execute({ token: 'any_token' })

    expect(loadFacebookUserAPI.token).toBe('any_token')
  })
})
