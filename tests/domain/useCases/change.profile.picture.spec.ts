import { mock, MockProxy } from 'jest-mock-extended'
import { IUploadFile } from '@domain/contracts/gateways/file.storage'
import { IUUIDGenerator } from '@domain/contracts/gateways'
import { ChangeProfilePicture } from '@domain/useCases/change-profile-picture/change.profile.picture'

describe('ChangeProfilePicture', () => {
  let uuid: string
  let file: Buffer
  let fileStorage: MockProxy<IUploadFile>
  let crypto: MockProxy<IUUIDGenerator>
  let sut: ChangeProfilePicture

  beforeEach(() => {
    uuid = 'any_unique_id'
    file = Buffer.from('any_buffer')
    fileStorage = mock<IUploadFile>()
    crypto = mock<IUUIDGenerator>()
    crypto.uuid.mockReturnValue(uuid)
    sut = new ChangeProfilePicture(fileStorage, crypto)
  })

  it('Should call UploadFile withj corect input', async () => {
    await sut.save({ id: 'any_id', file })

    expect(fileStorage.upload).toHaveBeenCalledWith({ file, key: uuid })
    expect(fileStorage.upload).toHaveBeenCalledTimes(1)
  })

  it('Should not call UploadFile when file is undefined', async () => {
    await sut.save({ id: 'any_id', file: undefined as any })

    expect(fileStorage.upload).not.toHaveBeenCalled()
  })
})
