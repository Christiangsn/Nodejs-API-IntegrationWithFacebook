
import { ISaveUserPicture } from '@domain/contracts/repositories'

import { getRepository } from 'typeorm'
import { UserEntity } from '../entities'

export class UserProfileRepository implements ISaveUserPicture {
  public async savePicture ({ id, initials, pictureUrl }: ISaveUserPicture.Input): Promise<void> {
    const pgUserRepo = getRepository(UserEntity)
    await pgUserRepo.update({ id: Number(id) }, {
      pictureUrl,
      initials
    })
  }
}
