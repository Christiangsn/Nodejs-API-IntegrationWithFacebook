/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-extraneous-class */
import { AwsS3FileStorage } from '@infra/gateways/aw.s3.fileStorage'
import { config, S3 } from 'aws-sdk'

jest.mock('aws-sdk')

describe('AwS3FileStorage', () => {
  const acessKey = 'any_access_key'
  const secret = 'any_secret'
  const bucket = 'any_bucket'
  const key = 'any_key'
  const file = Buffer.from('any_buffer')

  let sut: AwsS3FileStorage

  beforeEach(() => {
    sut = new AwsS3FileStorage(acessKey, secret, bucket)
  })

  describe('upload', () => {
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

      await sut.upload({ fileName: key, file })

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
      const imageUrl = await sut.upload({ fileName: key, file })

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
      const imageUrl = await sut.upload({ fileName: 'any key', file })

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
      const promise = sut.upload({ fileName: key, file })

      expect(promise).rejects.toThrow(error)
    })
  })

  describe('delete', () => {
    let deleteObjectPromiseSpy: jest.Mock
    let deleteObjectSpy: jest.Mock

    beforeAll(() => {
      deleteObjectPromiseSpy = jest.fn()
      deleteObjectSpy = jest.fn().mockImplementation(() => ({ promise: deleteObjectPromiseSpy }))
      jest.mocked(S3).mockImplementation(jest.fn().mockImplementation(() => ({ deleteObject: deleteObjectSpy })))
    })

    it('Should call deleteObject with correct input', async () => {
      await sut.delete({ fileName: key })

      expect(deleteObjectSpy).toBeCalledWith({
        Bucket: bucket,
        Key: key
      })
      expect(deleteObjectPromiseSpy).toHaveBeenCalledTimes(1)
    })

    it('Should retrow if deleteObject throws', async () => {
      const error = new Error('Delete Error File')
      deleteObjectPromiseSpy.mockRejectedValueOnce(error)
      const promise = sut.delete({ fileName: key })

      await expect(promise).rejects.toThrow(error)
    })
  })
})
