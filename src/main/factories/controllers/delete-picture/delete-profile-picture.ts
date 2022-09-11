import { DeletePictureController } from '@app/controllers/delete-profile-picture/delete-profile-picture'
import { Controller } from '@app/controllers/controller'
import { makeChangeProfilePictureUseCases } from '@main/factories/useCases'

export const makeDeleteProfilePictureController = (): Controller => {
  return new DeletePictureController(makeChangeProfilePictureUseCases())
}
