/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { IUUIDGenerator } from '@domain/contracts/gateways'
import { IDeleteFile, IUploadFile } from '@domain/contracts/gateways/file.storage'
import { ILoadUserProfile, ISaveUserPicture } from '@domain/contracts/repositories'
import { UserProfile } from '@domain/entities'
import { IProfilePicture } from '@domain/features/change-profile-picture/change.profile.picture'

export class ChangeProfilePicture implements IProfilePicture {
  constructor (
    private readonly fileStorage: IUploadFile & IDeleteFile,
    private readonly crypto: IUUIDGenerator,
    private readonly profilePicture: ISaveUserPicture & ILoadUserProfile
  ) {}

  public async save ({ file, id }: IProfilePicture.Input): Promise<IProfilePicture.Output> {
    let pictureUrl: string | undefined
    let name: string | undefined

    const key = this.crypto.uuid({
      key: id
    })

    if (file !== undefined) {
      pictureUrl = await this.fileStorage.upload({ file, key })
    } else {
      // Pegar o name
      name = (await this.profilePicture.load({ id })).name
    }

    const userProfile = new UserProfile(id)
    userProfile.setPicture({ pictureUrl, name })

    try {
      await this.profilePicture.savePicture(userProfile)
    } catch (err) {
      if (file !== undefined) {
        await this.fileStorage.delete({ key })
        // throw err
      }
    }

    return userProfile
  }
}
