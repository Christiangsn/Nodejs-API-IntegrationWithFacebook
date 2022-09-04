/* eslint-disable @typescript-eslint/no-invalid-void-type */
export interface IProfilePicture {
  save: (props: IProfilePicture.Input) => Promise<IProfilePicture.Output>
}

export namespace IProfilePicture {
  export type Input = {
    id: string
    file: Buffer
  }

  export type Output = void
}
