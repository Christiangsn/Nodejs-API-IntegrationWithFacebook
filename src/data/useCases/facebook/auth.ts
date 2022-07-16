import { ILoadFacebookUserAPI } from '@data/contracts'
import { IFacebookAuth } from '@domain/contracts'
import { TAuthenticationError } from '@domain/error'

export class FacebookAuthenticationUseCases implements IFacebookAuth {
  constructor (
    private readonly loadFacebookUseByTokenAPI: ILoadFacebookUserAPI
  ) {}

  public async execute ({ token }: IFacebookAuth.Params): Promise<TAuthenticationError> {
    await this.loadFacebookUseByTokenAPI.generation({ token })
    return new TAuthenticationError()
  }
}
