import { Controller } from '@app/controllers/controller'
import { IHttpResponse } from '@app/helpers/http'
import { NoContent } from '@app/helpers/responses/no.content'
import { IProfilePicture } from '@domain/features/change-profile-picture/change.profile.picture'
import { mock, MockProxy } from 'jest-mock-extended'

type HttpRequest = { userId: string }

class DeletePictureController extends Controller {
  constructor (
    private readonly changeProfilePicture: IProfilePicture
  ) {
    super()
  }

  public async execute ({ userId }: HttpRequest): Promise<IHttpResponse> {
    await this.changeProfilePicture.save({ id: userId })
    return NoContent()
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

  it('Should return 204', async () => {
    const httpResonse = await sut.execute({ userId: 'any_user_id' })
    expect(httpResonse).toEqual({
      statusCode: 204,
      data: null
    })
  })

  it('Should extend Controler', async () => {
    expect(sut).toBeInstanceOf(Controller)
  })
})
