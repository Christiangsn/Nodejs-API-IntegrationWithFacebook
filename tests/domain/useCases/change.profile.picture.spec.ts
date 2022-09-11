import { mock, MockProxy } from 'jest-mock-extended'
import { IUploadFile, IDeleteFile } from '@domain/contracts/gateways/file.storage'
import { IUUIDGenerator } from '@domain/contracts/gateways'
import { ChangeProfilePicture } from '@domain/useCases/change-profile-picture/change.profile.picture'
import { ILoadUserProfile, ISaveUserPicture } from '@domain/contracts/repositories'
import { UserProfile } from '@domain/entities'

jest.mock('@domain/entities/user.profile.entity')

describe('ChangeProfilePicture', () => {
  let uuid: string
  let buffer: Buffer
  let mimeType: string
  let file: {
    buffer: Buffer
    mimeType: string
  }
  let fileStorage: MockProxy<IUploadFile & IDeleteFile>
  let crypto: MockProxy<IUUIDGenerator>
  let userProfileRepository: MockProxy<ISaveUserPicture & ILoadUserProfile>
  let sut: ChangeProfilePicture

  beforeEach(() => {
    uuid = 'any_unique_id'
    buffer = Buffer.from('any_buffer')
    mimeType = 'image/png'
    file = { buffer, mimeType }
    fileStorage = mock<IUploadFile & IDeleteFile>()
    fileStorage.upload.mockResolvedValue('any_url')

    crypto = mock<IUUIDGenerator>()
    crypto.uuid.mockReturnValue(uuid)

    userProfileRepository = mock()
    userProfileRepository.load.mockResolvedValue({ name: 'Christian Guimaraes dos Santos' })
    sut = new ChangeProfilePicture(fileStorage, crypto, userProfileRepository)
  })

  it('Should call UploadFile with corect input', async () => {
    await sut.save({ id: 'any_id', file: { buffer, mimeType: 'image/png' } })

    expect(fileStorage.upload).toHaveBeenCalledWith({ file: buffer, fileName: `${uuid}.png` })
    expect(fileStorage.upload).toHaveBeenCalledTimes(1)
  })

  it('Should call UploadFile with corect input', async () => {
    await sut.save({ id: 'any_id', file: { buffer, mimeType: 'image/jpg' } })

    expect(fileStorage.upload).toHaveBeenCalledWith({ file: buffer, fileName: `${uuid}.jpg` })
    expect(fileStorage.upload).toHaveBeenCalledTimes(1)
  })

  it('Should not call UploadFile when file is undefined', async () => {
    await sut.save({ id: 'any_id', file: undefined as any })

    expect(fileStorage.upload).not.toHaveBeenCalled()
  })

  it('Should call SaveUserPicture with correct input', async () => {
    const mockMethod = jest.fn()
    const setPicture = jest.fn().mockImplementation(() => {
      return {
        setPicture: mockMethod
      }
    })
    jest.mocked(UserProfile).mockImplementation(setPicture)

    await sut.save({ id: 'any_id', file })

    expect(userProfileRepository.savePicture).toHaveBeenCalled()
    expect(userProfileRepository.savePicture).toHaveBeenCalledTimes(1)
  })

  it('Should call SaveUserPicture with correct input', async () => {
    const mockMethod = jest.fn()
    const setPicture = jest.fn().mockImplementation(() => {
      return {
        setPicture: mockMethod
      }
    })

    userProfileRepository.load.mockResolvedValueOnce(undefined)
    jest.mocked(UserProfile).mockImplementation(setPicture)

    await sut.save({ id: 'any_id', file })

    expect(userProfileRepository.savePicture).toHaveBeenCalled()
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

  it('Should return correct data on succes', async () => {
    jest.mocked(UserProfile).mockImplementationOnce(id => ({
      setPicture: jest.fn(),
      id: 'any_id',
      pictureUrl: 'any_url',
      initials: 'any_initials'
    }))
    const result = await sut.save({ id: 'any_id', file })

    expect(result).toMatchObject({
      pictureUrl: 'any_url',
      initials: 'any_initials'
    })
  })

  it('Should call DeleteFile whyen file exists and SaveUserPicture throws', async () => {
    userProfileRepository.savePicture.mockRejectedValueOnce(new Error())
    const promise = sut.save({ id: 'any_id', file })

    promise.then(() => {
    }).catch(() => {
      expect(fileStorage.delete).toHaveBeenCalledWith({ fileName: uuid })
      expect(fileStorage.delete).toHaveBeenCalledTimes(1)
    })
  })

  it('Should  not call DeleteFile when file does not exists and SavUserPicture Throws', async () => {
    userProfileRepository.savePicture.mockRejectedValueOnce(new Error())
    const promise = sut.save({ id: 'any_id', file: undefined })

    promise.then(() => {
    }).catch(() => {
      expect(fileStorage.delete).not.toHaveBeenCalled()
    })
  })
})
