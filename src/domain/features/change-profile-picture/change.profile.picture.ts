/* eslint-disable @typescript-eslint/no-invalid-void-type */
export interface IProfilePicture {
  save: (props: IProfilePicture.Input) => Promise<IProfilePicture.Output>
}

export namespace IProfilePicture {
  export type Input = {
    id: string
    file?: {
      buffer: Buffer
      mimeType: string
    }
  }

  export type Output = { pictureUrl?: string, initials?: string }
}
