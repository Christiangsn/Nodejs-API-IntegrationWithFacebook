import { AwsS3FileStorage } from '@infra/gateways/aw.s3.fileStorage'
import { env } from '@main/config/env'

import axios from 'axios'

describe('Aws s3 Apí Integration Tests', () => {
  let sut: AwsS3FileStorage

  beforeEach(() => {
    sut = new AwsS3FileStorage(
      env.s3.accessKey,
      env.s3.secret,
      env.s3.bucket
    )
  })

  it('Should upload image to aws s3', async () => {
    const onePixelImage = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAA1JREFUGFdj+M/A8B8ABQAB/6Zcm10AAAAASUVORK5CYII='
    const file = Buffer.from(onePixelImage, 'base64')
    const pictureUrl = await sut.upload({
      fileName: 'any_key.png',
      file
    })

    expect((await axios.get(pictureUrl)).status).toBe(200)
  })

  it('Should upload and delete image from aws s3', async () => {
    const onePixelImage = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAA1JREFUGFdj+M/A8B8ABQAB/6Zcm10AAAAASUVORK5CYII='
    const file = Buffer.from(onePixelImage, 'base64')
    const pictureUrl = await sut.upload({
      fileName: 'any_key.png',
      file
    })

    expect((await axios.get(pictureUrl)).status).toBe(200)

    await sut.delete({ fileName: 'any_key.png' })

    await expect(axios.get(pictureUrl)).rejects.toThrow()
  })
})
