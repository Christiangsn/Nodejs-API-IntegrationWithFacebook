
export interface ILoudUserAccountRepository {
  check: ({ email }: ILoudUserAccountRepository.Params) => Promise<void>
}

export namespace ILoudUserAccountRepository {
  export type Params = {
    email: string
  }
}
