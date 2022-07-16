import { AccessToken, FacebookAccount } from '@domain/models'

import { ILoadFacebookUserAPI } from '@data/contracts/facebook'
import { ITokenGeneration } from '@data/contracts/crypto'
import { ILoudUserAccountRepository, ISaveFacebookAccountRepository } from '@data/contracts/repositories'
import { IFacebookAuth } from '@domain/contracts'
import { TAuthenticationError } from '@domain/error'

export class FacebookAuthenticationUseCases implements IFacebookAuth {
  constructor (
    private readonly loadFacebookUseByTokenAPI: ILoadFacebookUserAPI,
    private readonly userAccountRepository: ILoudUserAccountRepository & ISaveFacebookAccountRepository,
    private readonly cryptography: ITokenGeneration
  ) {}

  public async execute ({ token }: IFacebookAuth.Params): Promise<IFacebookAuth.Return> {
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
      const { id } = await this.userAccountRepository.saveWithFacebook(userAccount)

      // Gerar o token de autenticação
      const token = await this.cryptography.generation({
        key: id,
        expirationInMs: AccessToken.expirationInMs
      })

      return new AccessToken(token)
    }

    // Se não existir uma conta do token do facebook
    return new TAuthenticationError()
  }
}
