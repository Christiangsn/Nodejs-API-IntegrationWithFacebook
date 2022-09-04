import { IUUIDGenerator } from '@domain/contracts/gateways'
import { IUploadFile } from '@domain/contracts/gateways/file.storage'
import { IProfilePicture } from '@domain/features/change-profile-picture/change.profile.picture'

export class ChangeProfilePicture implements IProfilePicture {
  constructor (
    private readonly fileStorage: IUploadFile,
    private readonly crypto: IUUIDGenerator
  ) {}

  public async save ({ file, id }: IProfilePicture.Input): Promise<IProfilePicture.Output> {
    await this.fileStorage.upload({
      file,
      key: this.crypto.uuid({
        key: id
      })
    })
  }
}
