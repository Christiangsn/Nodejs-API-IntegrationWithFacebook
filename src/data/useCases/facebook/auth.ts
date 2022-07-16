import { ILoadFacebookUserAPI } from '@data/contracts/facebook'
import { ILoudUserAccountRepository, ICreateFacebookAccountRepository, IUpdatedFacebookAccountRepository } from '@data/contracts/repositories'
import { IFacebookAuth } from '@domain/contracts'
import { TAuthenticationError } from '@domain/error'

export class FacebookAuthenticationUseCases implements IFacebookAuth {
  constructor (
    private readonly loadFacebookUseByTokenAPI: ILoadFacebookUserAPI,
    private readonly userAccountRepository: ILoudUserAccountRepository & ICreateFacebookAccountRepository & IUpdatedFacebookAccountRepository
  ) {}

  public async execute ({ token }: IFacebookAuth.Params): Promise<TAuthenticationError> {
    const facebookDB = await this.loadFacebookUseByTokenAPI.generation({ token })

    // Se existir uma conta
    if (facebookDB !== undefined) {
      // Verificar se existe uma conta com o email do facebook na banco
      const accountData = await this.userAccountRepository.check({ email: facebookDB.email })

      // Se existir uma conta com um nome ai atualiza os dados com o nome
      if (accountData !== undefined) {
        // Atualizar os dados...
        await this.userAccountRepository.updatedWithFacebookData({
          id: accountData.id,
          facebookId: facebookDB.facebookId,
          name: accountData.name ?? facebookDB.name // Se existir um nome, registrar o nome, caso contrário envia o nome do facebook
        })
      } else {
        await this.userAccountRepository.createFromFacebook(facebookDB)
      }
    }

    // Se não existir uma conta do token do facebook
    return new TAuthenticationError()
  }
}
