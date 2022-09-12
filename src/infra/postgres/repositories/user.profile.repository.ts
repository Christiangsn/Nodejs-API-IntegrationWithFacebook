
import { ILoadUserProfile, ISaveUserPicture } from '@domain/contracts/repositories'

import { getRepository } from 'typeorm'
import { UserEntity } from '../entities'

export class UserProfileRepository implements ISaveUserPicture {
  public async savePicture ({ id, initials, pictureUrl }: ISaveUserPicture.Input): Promise<void> {
    const pgUserRepo = getRepository(UserEntity)
    await pgUserRepo.update({ id }, {
      pictureUrl,
      initials
    })
  }

  public async load ({ id }: ILoadUserProfile.Input): Promise<ILoadUserProfile.Output> {
    const pgUserRepo = getRepository(UserEntity)
    const user = await pgUserRepo.findOne({ id: Number(id) })
    if (user !== undefined) {
      return {
        name: user?.name ?? undefined
      }
    }
  }
}
