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

export interface ISaveFacebookAccountRepository {
  saveWithFacebook: ({ email, name, facebookId }: ISaveFacebookAccountRepository.Params) => Promise<ISaveFacebookAccountRepository.Return>
}

export namespace ISaveFacebookAccountRepository {
  export type Params = {
    id?: string
    email: string
    name: string
    facebookId: string
  }

  export type Return = {
    id: string
  }
}
