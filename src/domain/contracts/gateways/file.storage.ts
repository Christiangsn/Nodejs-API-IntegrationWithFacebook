export interface IUploadFile {
  upload: (input: IUploadFile.Input) => Promise<void>
}

export namespace IUploadFile {
  export type Input = {
    file: Buffer
    key: string
  }
}
