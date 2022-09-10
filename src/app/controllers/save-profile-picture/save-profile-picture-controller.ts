import { InvalidMymeTypeError, MaxFileSizeError, RequiredFieldError } from '@app/errors'
import { IHttpResponse } from '@app/helpers/http'
import { BadRequest, Success } from '@app/helpers/responses'
import { IProfilePicture } from '@domain/features/change-profile-picture/change.profile.picture'
import { Controller } from '../controller'

type HttpRequest = {
  file: {
    buffer: Buffer
    mimeType: string
  }
  userId: string
}

  type Model = Error | { initials?: string, pictureUrl?: string }

export class SavePictureController extends Controller {
  constructor (
    private readonly changeProfilePicture: IProfilePicture
  ) {
    super()
  }

  public async execute ({ file, userId }: HttpRequest): Promise<IHttpResponse<Model>> {
    if (file === undefined || file === null) {
      return BadRequest(new RequiredFieldError('file'))
    }

    if (file.buffer.length === 0) {
      return BadRequest(new RequiredFieldError('file'))
    }

    if (!['image/png', 'image/jpeg', 'image/jpg'].includes(file.mimeType)) {
      return BadRequest(new InvalidMymeTypeError(['png', 'jpg', 'jpeg']))
    }

    if (file.buffer.length > 5 * 1024 * 1024) {
      return BadRequest(new MaxFileSizeError(5))
    }

    const data = await this.changeProfilePicture.save({ id: userId, file: file.buffer })

    return Success(data)
  }
}
