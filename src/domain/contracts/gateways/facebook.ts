export interface ILoadFacebookUser {
  generation: ({ token }: ILoadFacebookUser.Params) => Promise<ILoadFacebookUser.Return>
}

export namespace ILoadFacebookUser {
  export type Params = {
    token: string
  }

  export type Return = undefined | {
    name: string
    facebookId: string
    email: string
  }
}
