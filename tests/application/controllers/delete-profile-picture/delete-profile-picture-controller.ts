import { IProfilePicture } from '@domain/features/change-profile-picture/change.profile.picture'
import { mock } from 'jest-mock-extended'

type HttpRequest = { userId: string }

class DeletePictureController {
  constructor (
    private readonly changeProfilePicture: IProfilePicture
  ) { }

  public async execute ({ userId }: HttpRequest): Promise<void> {
    await this.changeProfilePicture.save({ id: userId })
  }
}

describe('Should call ChangeProfile with corrrect input', () => {
  it('Should call ChangeProfile with corrrect input', async () => {
    const changeProfilePicture = mock<IProfilePicture>()
    const sut = new DeletePictureController(changeProfilePicture)

    await sut.execute({ userId: 'any_user_id' })
    expect(changeProfilePicture.save).toHaveBeenCalledWith({ id: 'any_user_id' })
  })
})
