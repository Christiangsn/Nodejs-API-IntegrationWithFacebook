import { Controller } from '@app/controllers/controller'
import { SavePictureController } from '@app/controllers/save-profile-picture/save-profile-picture-controller'
import { makeChangeProfilePictureUseCases } from '@main/factories/useCases'

export const makeSaveProfilePictureController = (): Controller => {
  return new SavePictureController(makeChangeProfilePictureUseCases())
}
