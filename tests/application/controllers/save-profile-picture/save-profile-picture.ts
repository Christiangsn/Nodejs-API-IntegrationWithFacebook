import { BadRequest } from './../../../../src/app/helpers/responses/bad.request'
import { IHttpResponse } from './../../../../src/app/helpers/http/index'
import { RequiredFieldError } from '@app/errors/http/http.required.filed'

type HttpRequest = {
  file: any
}

type Model = Error

export class SavePictureController {
  public async execute ({ file }: HttpRequest): Promise<IHttpResponse<Model>> {
    return BadRequest(new RequiredFieldError('file'))
  }
}

describe('SavePictureController', () => {
  it('Should return 400 if file is not provided', async () => {
    const sut = new SavePictureController()

    const httpResponse = await sut.execute({ file: undefined })

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new RequiredFieldError('file')
    })
  })
})
