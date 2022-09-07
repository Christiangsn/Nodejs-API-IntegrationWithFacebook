export interface IUploadFile {
  upload: (input: IUploadFile.Input) => Promise<IUploadFile.Output>
}

export namespace IUploadFile {
  export type Input = {
    file: Buffer
    key: string
  }
  export type Output = string
}

export interface IDeleteFile {
  delete: (input: IDeleteFile.Input) => Promise<void>
}

export namespace IDeleteFile {
  export type Input = {
    key: string
  }
}
