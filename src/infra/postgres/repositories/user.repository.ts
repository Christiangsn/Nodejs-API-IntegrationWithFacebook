import { ILoudUserAccountRepository, ISaveFacebookAccountRepository } from '@domain/contracts/repositories'

import { getRepository } from 'typeorm'
import { UserEntity } from '../entities'

// Simplificar parametros grandes
type TLoadParams = ILoudUserAccountRepository.Params
type TSaveFBParams = ISaveFacebookAccountRepository.Params

type TSaveFBReturn = ISaveFacebookAccountRepository.Return

export class UserAccountRepository implements ILoudUserAccountRepository, ISaveFacebookAccountRepository {
  public async check ({ email }: TLoadParams): Promise<ILoudUserAccountRepository.Return> {
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

  public async saveWithFacebook ({ id, email, facebookId, name }: TSaveFBParams): Promise<TSaveFBReturn> {
    const userRepository = getRepository(UserEntity)

    // Se não existir o ID enviado por parametro - Criar um usuario
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (!id) {
      const newUser = await userRepository.save({ email, facebookId, name })
      return {
        id: String(newUser.id)
      }
    }

    // Se existir um id dar um update nos dados
    await userRepository.update({
      id: Number(id)
    }, {
      name,
      facebookId
    })

    return {
      id: String(id)
    }
  }
}
