export interface ITokenGeneration {
  generation: ({ key, expirationInMs }: ITokenGeneration.Params) => Promise<ITokenGeneration.Return>
}

export namespace ITokenGeneration {
  export type Params = {
    key: string
    expirationInMs: number
  }

  export type Return = string
}
