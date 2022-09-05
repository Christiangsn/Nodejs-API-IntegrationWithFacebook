export interface ISaveUserPicture {
  savePicture: ({ pictureUrl }: ISaveUserPicture.Input) => Promise<void>
}

export namespace ISaveUserPicture {
  export type Input = {
    pictureUrl?: string
  }

  export type Ouput = null
}

export interface ILoadUserProfile {
  load: ({ id }: ILoadUserProfile.Input) => Promise<void>
}

export namespace ILoadUserProfile {
  export type Input = {
    id: string
  }

}
