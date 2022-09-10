import { BadRequest } from '@app/helpers/responses/bad.request'
import { IHttpResponse } from '@app/helpers/http/index'
import { RequiredFieldError } from '@app/errors/http/http.required.filed'

type HttpRequest = {
  file: {
    buffer: Buffer
    mimeType: string
  }
}

type Model = Error

export class SavePictureController {
  public async execute ({ file }: HttpRequest): Promise<IHttpResponse<Model>> {
    if (!!file.buffer.length) {
      return BadRequest(new RequiredFieldError('file'))
    }

    if (!!file) {
      return BadRequest(new RequiredFieldError('file'))
    }

    return BadRequest(new InvalidMymeTypeError(['png', 'jpg', 'jpeg']))
  }
}

export class InvalidMymeTypeError extends Error {
  constructor (public allowed: string[]) {
    super(`Unsupported type. Allowed types: ${allowed.join(', ')} `)
    this.name = 'Unsupported type'
  }
}

describe('SavePictureController', () => {
  let buffer: Buffer
  let mimeType: string
  //   let file: {
  //     buffer: Buffer,
  //     mimeType: string
  //   }
  let sut: SavePictureController

  beforeEach(() => {
    sut = new SavePictureController()
  })

  beforeAll(() => {
    buffer = Buffer.from('any_buffer')
    mimeType = 'image/png'
    // file = {
    //     buffer
    // }
  })

  it('Should return 400 if file is not provided', async () => {
    const httpResponse = await sut.execute({ file: undefined as any })

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new RequiredFieldError('file')
    })
  })

  it('Should return 400 if file is null', async () => {
    const httpResponse = await sut.execute({ file: null as any })

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new RequiredFieldError('file')
    })
  })

  it('Should return 400 if file is empty', async () => {
    const httpResponse = await sut.execute({
      file: {
        buffer: Buffer.from(''),
        mimeType
      }
    })

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new RequiredFieldError('file')
    })
  })

  it('Should return 400 if file type is invalid', async () => {
    const httpResponse = await sut.execute({
      file: {
        buffer,
        mimeType: 'invalid_type'
      }
    })

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new InvalidMymeTypeError(['png', 'jpg', 'jpeg'])
    })
  })
})
