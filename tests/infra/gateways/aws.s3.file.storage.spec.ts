/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-extraneous-class */
import { IUploadFile } from '@domain/contracts/gateways/file.storage'
import { config, S3 } from 'aws-sdk'

jest.mock('aws-sdk')

class AwS3FileStorage {
  constructor (
    public acessKey: string,
    public secret: string,
    private readonly bucket: string
  ) {
    config.update({
      credentials: {
        accessKeyId: acessKey,
        secretAccessKey: secret
      }
    })
  }

  public async upload ({ key, file }: IUploadFile.Input) {
    const s3 = new S3()
    await s3.putObject({
      Bucket: this.bucket,
      Key: key,
      Body: file,
      ACL: 'public-read'
    }).promise()
  }
}

describe('AwS3FileStorage', () => {
  const acessKey = 'any_access_key'
  const secret = 'any_secret'
  const bucket = 'any_bucket'
  const key = 'any_key'
  const file = Buffer.from('any_buffer')

  let sut: AwS3FileStorage

  beforeEach(() => {
    sut = new AwS3FileStorage(acessKey, secret, bucket)
  })

  it('Should config aws credentials on creation', () => {
    expect(config.update).toHaveBeenCalledWith({
      credentials: {
        accessKeyId: acessKey,
        secretAccessKey: secret
      }
    })
    expect(config.update).toHaveBeenCalledTimes(1)
  })

  it('Should call putObject with correct input', async () => {
    const putObjectPromiseSpy = jest.fn()
    const putObjectSpy = jest.fn().mockImplementationOnce(() => ({ promise: putObjectPromiseSpy }))
    jest.mocked(S3).mockImplementationOnce(jest.fn().mockImplementationOnce(() => {
      return {
        putObject: putObjectSpy
      }
    }))

    await sut.upload({ key, file })

    expect(putObjectSpy).toHaveBeenCalledWith({
      Bucket: bucket,
      Key: key,
      Body: file,
      ACL: 'public-read'
    })
    expect(putObjectSpy).toHaveBeenCalledTimes(1)
    expect(putObjectPromiseSpy).toHaveBeenCalledTimes(1)
  })
})
