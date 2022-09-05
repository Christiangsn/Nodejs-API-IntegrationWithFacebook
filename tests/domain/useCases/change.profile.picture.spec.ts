import { mock, MockProxy } from 'jest-mock-extended'
import { IUploadFile } from '@domain/contracts/gateways/file.storage'
import { IUUIDGenerator } from '@domain/contracts/gateways'
import { ChangeProfilePicture } from '@domain/useCases/change-profile-picture/change.profile.picture'
import { ILoadUserProfile, ISaveUserPicture } from '@domain/contracts/repositories'

describe('ChangeProfilePicture', () => {
  let uuid: string
  let file: Buffer
  let fileStorage: MockProxy<IUploadFile>
  let crypto: MockProxy<IUUIDGenerator>
  let userProfileRepository: MockProxy<ISaveUserPicture & ILoadUserProfile>
  let sut: ChangeProfilePicture

  beforeEach(() => {
    uuid = 'any_unique_id'
    file = Buffer.from('any_buffer')

    fileStorage = mock<IUploadFile>()
    fileStorage.upload.mockResolvedValue('any_url')

    crypto = mock<IUUIDGenerator>()
    crypto.uuid.mockReturnValue(uuid)

    userProfileRepository = mock()
    userProfileRepository.load.mockResolvedValue({ name: 'Christian Guimaraes dos Santos' })
    sut = new ChangeProfilePicture(fileStorage, crypto, userProfileRepository)
  })

  it('Should call UploadFile with corect input', async () => {
    await sut.save({ id: 'any_id', file })

    expect(fileStorage.upload).toHaveBeenCalledWith({ file, key: uuid })
    expect(fileStorage.upload).toHaveBeenCalledTimes(1)
  })

  it('Should not call UploadFile when file is undefined', async () => {
    await sut.save({ id: 'any_id', file: undefined as any })

    expect(fileStorage.upload).not.toHaveBeenCalled()
  })

  it('Should call SaveUserPicture with correct input', async () => {
    await sut.save({ id: 'any_id', file })

    expect(userProfileRepository.savePicture).toHaveBeenCalledWith({ pictureUrl: 'any_url', initials: undefined })
    expect(userProfileRepository.savePicture).toHaveBeenCalledTimes(1)
  })

  it('Should call SaveUserPicture with correct input when file undefined', async () => {
    await sut.save({ id: 'any_id', file: undefined })

    expect(userProfileRepository.savePicture).toHaveBeenCalledWith({ pictureUrl: undefined, initials: 'CS' })
    expect(userProfileRepository.savePicture).toHaveBeenCalledTimes(1)
  })

  it('Should call SaveUserPicture with correct input when file undefined', async () => {
    userProfileRepository.load.mockResolvedValueOnce({ name: 'christian Guimaraes dos santos' })
    await sut.save({ id: 'any_id', file: undefined })

    expect(userProfileRepository.savePicture).toHaveBeenCalledWith({ pictureUrl: undefined, initials: 'CS' })
    expect(userProfileRepository.savePicture).toHaveBeenCalledTimes(1)
  })

  it('Should call SaveUserPicture with correct input when file undefined', async () => {
    userProfileRepository.load.mockResolvedValueOnce({ name: 'christian' })
    await sut.save({ id: 'any_id', file: undefined })

    expect(userProfileRepository.savePicture).toHaveBeenCalledWith({ pictureUrl: undefined, initials: 'CH' })
    expect(userProfileRepository.savePicture).toHaveBeenCalledTimes(1)
  })

  it('Should call SaveUserPicture with correct input when file undefined', async () => {
    userProfileRepository.load.mockResolvedValueOnce({ name: 'c' })
    await sut.save({ id: 'any_id', file: undefined })

    expect(userProfileRepository.savePicture).toHaveBeenCalledWith({ pictureUrl: undefined, initials: 'C' })
    expect(userProfileRepository.savePicture).toHaveBeenCalledTimes(1)
  })

  it('Should call SaveUserPicture with correct input when file undefined', async () => {
    userProfileRepository.load.mockResolvedValueOnce({ name: undefined })
    await sut.save({ id: 'any_id', file: undefined })

    expect(userProfileRepository.savePicture).toHaveBeenCalledWith({ pictureUrl: undefined, initials: undefined })
    expect(userProfileRepository.savePicture).toHaveBeenCalledTimes(1)
  })

  it('Should call LoadUserProfile with correct input', async () => {
    await sut.save({ id: 'any_id', file: undefined })

    expect(userProfileRepository.load).toHaveBeenCalledWith({ id: 'any_id' })
    expect(userProfileRepository.load).toHaveBeenCalledTimes(1)
  })

  it('Should not call LoadUserProfile if file exists', async () => {
    await sut.save({ id: 'any_id', file })

    expect(userProfileRepository.load).not.toHaveBeenCalled()
  })
})
