import { ILoudUserAccountRepository, ISaveFacebookAccountRepository } from '@data/contracts/repositories'

import { getRepository } from 'typeorm'
import { UserEntity } from '../entities'

// Simplificar parametros grandes
type TLoadParams = ILoudUserAccountRepository.Params
type TSaveFBParams = ISaveFacebookAccountRepository.Params

export class UserAccountRepository implements ILoudUserAccountRepository {
  private readonly userRepository = getRepository(UserEntity)

  public async check ({ email }: TLoadParams): Promise<ILoudUserAccountRepository.Return> {
    const user = await this.userRepository.findOne({ email })

    // Validar se o usuário não vai retornar vazio do banco
    if (user !== undefined) {
      return {
        id: user?.id.toString(),
        name: user?.name ?? undefined
      }
    }
  }

  public async saveWithFacebook ({ id, email, facebookId, name }: TSaveFBParams): Promise<void> {
    // Se não existir o ID enviado por parametro - Criar um usuario
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (!id) {
      await this.userRepository.save({ email, facebookId, name })
      return
    }

    // Se existir um id dar um update nos dados
    await this.userRepository.update({
      id: Number(id)
    }, {
      name,
      facebookId
    })
  }
}
