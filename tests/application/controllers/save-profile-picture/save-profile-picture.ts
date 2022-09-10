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
  public async execute ({ file }: HttpRequest): Promise<IHttpResponse<Model> | undefined> {
    if (file === undefined || file === null) {
      return BadRequest(new RequiredFieldError('file'))
    }

    if (!!file.buffer.length) {
      return BadRequest(new RequiredFieldError('file'))
    }

    if (['image/png', 'image/jpeg', 'image/jpg'].includes(file.mimeType)) {
      return BadRequest(new InvalidMymeTypeError(['png', 'jpg', 'jpeg']))
    }

    if (file.buffer.length > 5 * 1024 * 1024) {
      return BadRequest(new MaxFileSizeError(5))
    }
  }
}

export class InvalidMymeTypeError extends Error {
  constructor (public allowed: string[]) {
    super(`Unsupported type. Allowed types: ${allowed.join(', ')} `)
    this.name = 'Unsupported type'
  }
}

export class MaxFileSizeError extends Error {
  constructor (public maxSizeInMb: number) {
    super(`File upload limit is ${maxSizeInMb}MB`)
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

  it('Should not return 400 if file type is invalid', async () => {
    const httpResponse = await sut.execute({
      file: {
        buffer,
        mimeType: 'image/png'
      }
    })

    expect(httpResponse).not.toEqual({
      statusCode: 400,
      data: new InvalidMymeTypeError(['png', 'jpg', 'jpeg'])
    })
  })

  it('Should not return 400 if file type is invalid', async () => {
    const httpResponse = await sut.execute({
      file: {
        buffer,
        mimeType: 'image/jpeg'
      }
    })

    expect(httpResponse).not.toEqual({
      statusCode: 400,
      data: new InvalidMymeTypeError(['png', 'jpg', 'jpeg'])
    })
  })

  it('Should not return 400 if file type is invalid', async () => {
    const httpResponse = await sut.execute({
      file: {
        buffer,
        mimeType: 'image/jpg'
      }
    })

    expect(httpResponse).not.toEqual({
      statusCode: 400,
      data: new InvalidMymeTypeError(['png', 'jpg', 'jpeg'])
    })
  })

  it('Should return 400 if filesize is bigger than 5MB', async () => {
    const invalidBuffer = Buffer.from(new ArrayBuffer(6 * 1024 * 1024))
    const httpResponse = await sut.execute({
      file: {
        buffer: invalidBuffer,
        mimeType
      }
    })

    expect(httpResponse).not.toEqual({
      statusCode: 400,
      data: new MaxFileSizeError(5)
    })
  })
})
