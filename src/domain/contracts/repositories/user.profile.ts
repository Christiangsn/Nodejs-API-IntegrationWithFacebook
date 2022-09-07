export interface ISaveUserPicture {
  savePicture: ({ pictureUrl }: ISaveUserPicture.Input) => Promise<void>
}

export namespace ISaveUserPicture {
  export type Input = {
    id: string
    pictureUrl?: string
    initials?: string
  }

  export type Ouput = null
}

export interface ILoadUserProfile {
  load: ({ id }: ILoadUserProfile.Input) => Promise<ILoadUserProfile.Output>
}

export namespace ILoadUserProfile {
  export type Input = {
    id: string
  }
  export type Output = {
    name?: string
  }
}
