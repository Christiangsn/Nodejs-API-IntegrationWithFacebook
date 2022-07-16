import { ILoadFacebookUserAPI } from '@data/contracts/facebook'
import { ILoudUserAccountRepository, ISaveFacebookAccountRepository } from '@data/contracts/repositories'
import { IFacebookAuth } from '@domain/contracts'
import { TAuthenticationError } from '@domain/error'
import { FacebookAccount } from '@domain/models'

export class FacebookAuthenticationUseCases implements IFacebookAuth {
  constructor (
    private readonly loadFacebookUseByTokenAPI: ILoadFacebookUserAPI,
    private readonly userAccountRepository: ILoudUserAccountRepository & ISaveFacebookAccountRepository
  ) {}

  public async execute ({ token }: IFacebookAuth.Params): Promise<TAuthenticationError> {
    // Verificar se existe o token desta conta..
    const facebookDB = await this.loadFacebookUseByTokenAPI.generation({ token })

    // Se existir uma conta
    if (facebookDB !== undefined) {
      // Verificar se existe uma conta com o email do facebook na banco
      const accountData = await this.userAccountRepository.check({ email: facebookDB.email })

      // Criar o objeto de regra de negocios...
      // Validar o objeto da regra de negocio passando os parametros para validar...
      const userAccount = new FacebookAccount(facebookDB, accountData)

      // Repassar o objeto completo para a infra salvar ou atualizar...
      await this.userAccountRepository.saveWithFacebook(userAccount)
    }

    // Se não existir uma conta do token do facebook
    return new TAuthenticationError()
  }
}
