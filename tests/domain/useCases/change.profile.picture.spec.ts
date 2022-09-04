import { mock } from 'jest-mock-extended'
import { IProfilePicture } from '@domain/features/profile-picture'

export class ChangeProfilePicture implements IProfilePicture {
  constructor (
    private readonly fileStorage: IUploadFile
  ) {}

  public async save ({ file, id }: IProfilePicture.Input): Promise<IProfilePicture.Output> {
    await this.fileStorage.upload({ file, key: id })
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

describe('ChangeProfilePicture', () => {
  it('Should call UploadFile withj corect input', async () => {
    const file = Buffer.from('any_buffer')
    const fileStorage = mock<IUploadFile>()
    const sut = new ChangeProfilePicture(fileStorage)

    await sut.save({ id: 'any_id', file })

    expect(fileStorage.upload).toHaveBeenCalledWith({ file, key: 'any_id' })
    expect(fileStorage.upload).toHaveBeenCalledTimes(1)
  })
})
