import { ILoudUserAccountRepository, ISaveFacebookAccountRepository } from '@data/contracts/repositories'

import { getRepository } from 'typeorm'
import { UserEntity } from '../entities'

export class UserAccountRepository implements ILoudUserAccountRepository {
  public async check ({ email }: ILoudUserAccountRepository.Params): Promise<ILoudUserAccountRepository.Return> {
    const userRepository = getRepository(UserEntity)
    const user = await userRepository.findOne({ email })

    // Validar se o usuário não vai retornar vazio do banco
    if (user !== undefined) {
      return {
        id: user?.id.toString(),
        name: user?.name ?? undefined
      }
    }
  }

  public async saveWithFacebook ({ email, facebookId, name }: ISaveFacebookAccountRepository.Params): Promise<void> {
    const userRepository = getRepository(UserEntity)
    await userRepository.save({ email, facebookId, name })
  }
}
