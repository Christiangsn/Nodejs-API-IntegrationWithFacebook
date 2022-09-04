export interface ISaveUserPicture {
  savePicture: ({ pictureUrl }: ISaveUserPicture.Input) => Promise<void>
}

export namespace ISaveUserPicture {
  export type Input = {
    pictureUrl?: string
  }

  export type Ouput = null
}
