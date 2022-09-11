import { IHttpResponse } from '@app/helpers/http'
import { Success } from '@app/helpers/responses'
import { ValidationBuilder as Builder, Validator } from '@app/validators'
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

  override builderValidators ({ file }: HttpRequest): Validator[] {
    return [...Builder.of({ value: file, fieldName: 'file' }).required().image({ allowed: ['png', 'jpg'], maxSizeInMb: 5 }).build()]
  }

  public async execute ({ file, userId }: HttpRequest): Promise<IHttpResponse<Model>> {
    const data = await this.changeProfilePicture.save({ id: userId, file: file.buffer })

    return Success(data)
  }
}
