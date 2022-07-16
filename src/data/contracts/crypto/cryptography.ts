export interface ITokenGeneration {
  generation: ({ key }: ITokenGeneration.Params) => Promise<void>
}

export namespace ITokenGeneration {
  export type Params = {
    key: string
  }
}
