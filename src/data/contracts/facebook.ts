export interface ILoadFacebookUserAPI {
  generation: ({ token }: ILoadFacebookUserAPI.Params) => Promise<ILoadFacebookUserAPI.Return>
}

export namespace ILoadFacebookUserAPI {
  export type Params = {
    token: string
  }

  export type Return = undefined
}
