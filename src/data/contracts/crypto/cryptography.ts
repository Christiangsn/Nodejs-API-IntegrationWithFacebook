export interface ITokenGeneration {
  generation: ({ key, expirationInMs }: ITokenGeneration.Params) => Promise<void>
}

export namespace ITokenGeneration {
  export type Params = {
    key: string
    expirationInMs: number
  }
}
