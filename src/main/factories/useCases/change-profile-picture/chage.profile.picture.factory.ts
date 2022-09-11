import { ChangeProfilePicture } from '@domain/useCases/change-profile-picture/change.profile.picture'
import { makeUUIDHandler } from '@main/factories/crypto/uui.factory'
import { makeAwsS3FileStorage } from '@main/factories/gatways'
import { makeUserProfileRepository } from '@main/factories/repository/uer.profile.repository.factory'

export const makeChangeProfilePictureUseCases = (): ChangeProfilePicture => {
  return new ChangeProfilePicture(makeAwsS3FileStorage(), makeUUIDHandler(), makeUserProfileRepository())
}
