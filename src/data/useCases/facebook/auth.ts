import { ILoadFacebookUserAPI } from '@data/contracts/facebook'
import { ILoudUserAccountRepository, ICreateFacebookAccountRepository } from '@data/contracts/repositories'
import { IFacebookAuth } from '@domain/contracts'
import { TAuthenticationError } from '@domain/error'

export class FacebookAuthenticationUseCases implements IFacebookAuth {
  constructor (
    private readonly loadFacebookUseByTokenAPI: ILoadFacebookUserAPI,
    private readonly loadUserAccountRepository: ILoudUserAccountRepository,
    private readonly createFacebookAccountRepository: ICreateFacebookAccountRepository
  ) {}

  public async execute ({ token }: IFacebookAuth.Params): Promise<TAuthenticationError> {
    const facebookDB = await this.loadFacebookUseByTokenAPI.generation({ token })

    if (facebookDB !== undefined) {
      await this.loadUserAccountRepository.check({ email: facebookDB.email })
      await this.createFacebookAccountRepository.createFromFacebook(facebookDB)
    }

    return new TAuthenticationError()
  }
}
