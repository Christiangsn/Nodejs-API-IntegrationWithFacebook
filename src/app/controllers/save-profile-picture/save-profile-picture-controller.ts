import { IHttpResponse } from '@app/helpers/http'
import { Success } from '@app/helpers/responses'
import { AllowedMimeTypes, MaxFileSize, Required, RequiredBuffer, Validator } from '@app/validators'
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
    return [
      new Required(file, ''),
      new RequiredBuffer(file.buffer, 'file'),
      new AllowedMimeTypes(['jpeg', 'png'], file.mimeType),
      new MaxFileSize(5, file.buffer)
    ]
  }

  public async execute ({ file, userId }: HttpRequest): Promise<IHttpResponse<Model>> {
    const data = await this.changeProfilePicture.save({ id: userId, file: file.buffer })

    return Success(data)
  }
}
