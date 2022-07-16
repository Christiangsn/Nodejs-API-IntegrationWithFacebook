import { ILoadFacebookUserAPI } from '@data/contracts/facebook'
import { ILoudUserAccountRepository, ISaveFacebookAccountRepository } from '@data/contracts/repositories'
import { IFacebookAuth } from '@domain/contracts'
import { TAuthenticationError } from '@domain/error'

export class FacebookAuthenticationUseCases implements IFacebookAuth {
  constructor (
    private readonly loadFacebookUseByTokenAPI: ILoadFacebookUserAPI,
    private readonly userAccountRepository: ILoudUserAccountRepository & ISaveFacebookAccountRepository
  ) {}

  public async execute ({ token }: IFacebookAuth.Params): Promise<TAuthenticationError> {
    const facebookDB = await this.loadFacebookUseByTokenAPI.generation({ token })

    // Se existir uma conta
    if (facebookDB !== undefined) {
      // Verificar se existe uma conta com o email do facebook na banco
      const accountData = await this.userAccountRepository.check({ email: facebookDB.email })

      // Repassar o objeto completo para a infra salvar ou atualizar...
      await this.userAccountRepository.saveWithFacebook({
        id: accountData?.id,
        name: accountData?.name ?? facebookDB.name,
        email: facebookDB.email,
        facebookId: facebookDB.facebookId
      })
    }

    // Se não existir uma conta do token do facebook
    return new TAuthenticationError()
  }
}
