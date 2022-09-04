import { IUUIDGenerator } from '@domain/contracts/gateways'
import { IUploadFile } from '@domain/contracts/gateways/file.storage'
import { ISaveUserPicture } from '@domain/contracts/repositories'
import { IProfilePicture } from '@domain/features/change-profile-picture/change.profile.picture'

export class ChangeProfilePicture implements IProfilePicture {
  constructor (
    private readonly fileStorage: IUploadFile,
    private readonly crypto: IUUIDGenerator,
    private readonly profilePicture: ISaveUserPicture
  ) {}

  public async save ({ file, id }: IProfilePicture.Input): Promise<IProfilePicture.Output> {
    let pictureUrl: string | undefined

    if (file !== undefined) {
      pictureUrl = await this.fileStorage.upload({
        file,
        key: this.crypto.uuid({
          key: id
        })
      })
    }

    await this.profilePicture.savePicture({ pictureUrl })
  }
}
