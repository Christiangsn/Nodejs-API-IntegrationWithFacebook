import { IHttpResponse } from '@app/helpers/http'
import { NoContent } from '@app/helpers/responses/no.content'
import { IProfilePicture } from '@domain/features/change-profile-picture/change.profile.picture'
import { Controller } from '../controller'

type HttpRequest = { userId: string }

export class DeletePictureController extends Controller {
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
