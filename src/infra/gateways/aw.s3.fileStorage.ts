import { config, S3 } from 'aws-sdk'

import { IDeleteFile, IUploadFile } from '@domain/contracts/gateways/file.storage'

export class AwS3FileStorage implements IUploadFile, IDeleteFile {
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

  public async delete ({ key }: IDeleteFile.Input): Promise<void> {
    const s3 = new S3()
    await s3.deleteObject({
      Bucket: this.bucket,
      Key: key
    }).promise()
  }

  public async upload ({ key, file }: IUploadFile.Input): Promise<IUploadFile.Output> {
    const s3 = new S3()
    await s3.putObject({
      Bucket: this.bucket,
      Key: key,
      Body: file,
      ACL: 'public-read'
    }).promise()

    return `https://${this.bucket}.s3.amazonaws.com/${encodeURIComponent(key)}`
  }
}
