export interface ILoudUserAccountRepository {
  check: ({ email }: ILoudUserAccountRepository.Params) => Promise<ILoudUserAccountRepository.Return>
}

export namespace ILoudUserAccountRepository {
  export type Params = {
    email: string
  }

  export type Return = undefined | {
    id: string
    name?: string
  }
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

export interface IUpdatedFacebookAccountRepository {
  updatedWithFacebookData: ({ id, name, facebookId }: IUpdatedFacebookAccountRepository.Params) => Promise<void>
}

export namespace IUpdatedFacebookAccountRepository {
  export type Params = {
    id: string
    name: string
    facebookId: string
  }
}
