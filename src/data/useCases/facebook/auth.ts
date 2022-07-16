import { ILoadFacebookUserAPI } from '@data/contracts'
import { IFacebookAuth } from '@domain/contracts'

export class FacebookAuthenticationUseCases implements IFacebookAuth {
  constructor (
    private readonly loadFacebookUseByTokenAPI: ILoadFacebookUserAPI
  ) {}

  public async execute ({ token }: IFacebookAuth.Params): Promise<Error> {
    await this.loadFacebookUseByTokenAPI.generation({ token })
    return new Error()
  }
}
