export interface IHttpGetClient {
  get: (params: IHttpGetClient.Params) => Promise<IHttpGetClient.Return>
}

export namespace IHttpGetClient {
  export type Params = {
    url: string
    params: Object
  }

  export type Return = any
}
