
import { RequiredFieldError } from '@app/errors/http/http.required.filed'
import { mock, MockProxy } from 'jest-mock-extended'
import { IProfilePicture } from '@domain/features/change-profile-picture/change.profile.picture'
import { InvalidMymeTypeError, MaxFileSizeError } from '@app/errors'
import { SavePictureController } from '@app/controllers/save-profile-picture/save-profile-picture-controller'

describe('SavePictureController', () => {
  let buffer: Buffer
  let mimeType: string
  let userId: string
  let file: {
    buffer: Buffer
    mimeType: string
  }
  let sut: SavePictureController
  let ChangeProfilePicture: MockProxy<IProfilePicture>

  beforeEach(() => {
    sut = new SavePictureController(ChangeProfilePicture)
  })

  beforeAll(() => {
    buffer = Buffer.from('any_buffer')
    mimeType = 'image/png'
    file = {
      buffer,
      mimeType
    }
    userId = 'any_user_id'
    ChangeProfilePicture = mock()
    ChangeProfilePicture.save.mockRejectedValue({
      initials: 'any_initials',
      pictureUrl: 'any_picture_url'
    })
  })

  it('Should return 400 if file is not provided', async () => {
    const httpResponse = await sut.execute({ file: undefined as any, userId })

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new RequiredFieldError('file')
    })
  })

  it('Should return 400 if file is null', async () => {
    const httpResponse = await sut.execute({ file: null as any, userId })

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
      },
      userId
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
      },
      userId
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
      },
      userId
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
      },
      userId
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
      },
      userId
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
      },
      userId
    })

    expect(httpResponse).not.toEqual({
      statusCode: 400,
      data: new MaxFileSizeError(5)
    })
  })

  it('Should call ChangeProfilePicture with correct input', async () => {
    await sut.execute({
      file, userId
    })

    expect(ChangeProfilePicture).toHaveBeenCalledWith({
      id: userId,
      file: buffer
    })
    expect(ChangeProfilePicture).toHaveBeenCalledTimes(1)
  })

  it('Should return 200 with valid data', async () => {
    const httpResponse = await sut.execute({
      file, userId
    })

    expect(httpResponse).toEqual({
      statusCode: 200,
      data: {
        initials: 'any_initials',
        pictureUrl: 'any_picture_url'
      }
    })
  })
})
