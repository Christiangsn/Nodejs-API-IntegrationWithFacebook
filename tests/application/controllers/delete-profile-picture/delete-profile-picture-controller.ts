import { IProfilePicture } from '@domain/features/change-profile-picture/change.profile.picture'
import { mock, MockProxy } from 'jest-mock-extended'

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
  let changeProfilePicture: MockProxy<IProfilePicture>
  let sut: DeletePictureController

  beforeAll(() => {
    changeProfilePicture = mock()
  })

  beforeEach(() => {
    sut = new DeletePictureController(changeProfilePicture)
  })

  it('Should call ChangeProfile with corrrect input', async () => {
    await sut.execute({ userId: 'any_user_id' })
    expect(changeProfilePicture.save).toHaveBeenCalledWith({ id: 'any_user_id' })
  })
})
