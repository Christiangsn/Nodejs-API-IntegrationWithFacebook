/* eslint-disable @typescript-eslint/no-extraneous-class */
import { config } from 'aws-sdk'

jest.mock('aws-sdk')

class AwS3FileStorage {
  constructor (
    private readonly acessKey: string,
    private readonly secret: string
  ) {
    config.update({
      credentials: {
        accessKeyId: acessKey,
        secretAccessKey: secret
      }
    })
  }
}

describe('AwS3FileStorage', () => {
  const acessKey = 'any_access_key'
  const secret = 'any_secret'

  let sut: AwS3FileStorage

  beforeEach(() => {
    sut = new AwS3FileStorage(acessKey, secret)
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
})
