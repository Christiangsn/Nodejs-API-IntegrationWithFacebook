export interface IUUIDGenerator {
  uuid: (input: IUUIDGenerator.Input) => IUUIDGenerator.Output
}

export namespace IUUIDGenerator {
  export type Input = {
    key: string
  }
  export type Output = string
}
