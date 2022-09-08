/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-extraneous-class */
import { AwS3FileStorage } from '@infra/gateways/aw.s3.fileStorage'
import { config, S3 } from 'aws-sdk'

jest.mock('aws-sdk')

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

  it('Should return imageUrl', async () => {
    const putObjectPromiseSpy = jest.fn()
    const putObjectSpy = jest.fn().mockImplementationOnce(() => ({ promise: putObjectPromiseSpy }))
    jest.mocked(S3).mockImplementationOnce(jest.fn().mockImplementationOnce(() => {
      return {
        putObject: putObjectSpy
      }
    }))
    const imageUrl = await sut.upload({ key, file })

    expect(imageUrl).toBe(`https://${bucket}.s3.amazonaws.com/${key}`)
  })

  it('Should return encoded imageUrl', async () => {
    const putObjectPromiseSpy = jest.fn()
    const putObjectSpy = jest.fn().mockImplementationOnce(() => ({ promise: putObjectPromiseSpy }))
    jest.mocked(S3).mockImplementationOnce(jest.fn().mockImplementationOnce(() => {
      return {
        putObject: putObjectSpy
      }
    }))
    const imageUrl = await sut.upload({ key: 'any key', file })

    expect(imageUrl).toBe(`https://${bucket}.s3.amazonaws.com/any%20key`)
  })

  it('Should retrow if putObject throws', async () => {
    const putObjectPromiseSpy = jest.fn()
    const putObjectSpy = jest.fn().mockImplementationOnce(() => ({ promise: putObjectPromiseSpy }))
    jest.mocked(S3).mockImplementationOnce(jest.fn().mockImplementationOnce(() => {
      return {
        putObject: putObjectSpy
      }
    }))

    const error = new Error('Error File')
    putObjectPromiseSpy.mockRejectedValueOnce(error)
    const promise = sut.upload({ key, file })

    expect(promise).rejects.toThrow(error)
  })
})
