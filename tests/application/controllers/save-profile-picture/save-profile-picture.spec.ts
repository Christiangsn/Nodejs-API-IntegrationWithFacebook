import { mock, MockProxy } from 'jest-mock-extended'
import { IProfilePicture } from '@domain/features/change-profile-picture/change.profile.picture'

import { SavePictureController } from '@app/controllers/save-profile-picture/save-profile-picture-controller'
import { Controller } from '@app/controllers/controller'

describe('SavePictureController', () => {
  let buffer: Buffer
  let mimeType: string
  let userId: string
  let file: {
    buffer: Buffer
    mimeType: string
  }
  let sut: SavePictureController
  let changeProfilePicture: MockProxy<IProfilePicture>

  beforeEach(() => {
    changeProfilePicture = mock()
    changeProfilePicture.save.mockResolvedValue({
      initials: 'any_initials',
      pictureUrl: 'any_picture_url'
    })
    sut = new SavePictureController(changeProfilePicture)
  })

  beforeAll(() => {
    buffer = Buffer.from('any_buffer')
    mimeType = 'image/png'
    file = {
      buffer,
      mimeType
    }
    userId = 'any_user_id'
  })

  //   it('should build validators correctly', async () => {
  //     const validators = sut.builderValidators({ file, userId })

  //     expect(validators).toEqual([
  //       new Required(file, ''),
  //       new RequiredBuffer(buffer, 'file'),
  //       new AllowedMimeTypes(['jpeg', 'png'], mimeType),
  //       new MaxFileSize(5, buffer)
  //     ])
  //   })

  it('Should call ChangeProfilePicture with correct input', async () => {
    await sut.execute({
      file, userId
    })

    expect(changeProfilePicture.save).toHaveBeenCalledWith({
      id: userId,
      file: file.buffer
    })
    expect(changeProfilePicture.save).toHaveBeenCalledTimes(1)
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

  it('Should extend Controler', async () => {
    expect(sut).toBeInstanceOf(Controller)
  })
})
