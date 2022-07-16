export interface ILoudUserAccountRepository {
  check: ({ email }: ILoudUserAccountRepository.Params) => Promise<ILoudUserAccountRepository.Return>
}

export namespace ILoudUserAccountRepository {
  export type Params = {
    email: string
  }

  export type Return = undefined
}

export interface ICreateFacebookAccountRepository {
  createFromFacebook: ({ email, name, facebookId }: ICreateFacebookAccountRepository.Params) => Promise<void>
}

export namespace ICreateFacebookAccountRepository {
  export type Params = {
    email: string
    name: string
    facebookId: string
  }
}
