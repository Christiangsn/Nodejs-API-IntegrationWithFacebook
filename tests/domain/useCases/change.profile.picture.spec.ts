import { mock, MockProxy } from 'jest-mock-extended'
import { IProfilePicture } from '@domain/features/profile-picture'

export class ChangeProfilePicture implements IProfilePicture {
  constructor (
    private readonly fileStorage: IUploadFile,
    private readonly crypto: IUUIDGenerator
  ) {}

  public async save ({ file, id }: IProfilePicture.Input): Promise<IProfilePicture.Output> {
    await this.fileStorage.upload({
      file,
      key: this.crypto.uuid({
        key: id
      })
    })
  }
}

interface IUploadFile {
  upload: (input: IUploadFile.Input) => Promise<void>
}

namespace IUploadFile {
  export type Input = {
    file: Buffer
    key: string
  }
}

interface IUUIDGenerator {
  uuid: (input: IUUIDGenerator.Input) => IUUIDGenerator.Output
}

namespace IUUIDGenerator {
  export type Input = {
    key: string
  }
  export type Output = string
}

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
})
