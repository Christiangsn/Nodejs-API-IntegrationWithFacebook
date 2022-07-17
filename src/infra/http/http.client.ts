export interface IHttpGetClient {
  get: (params: IHttpGetClient.Params) => Promise<void>
}

export namespace IHttpGetClient {
  export type Params = {
    url: string
    params: {
      client_id: string
      client_secret: string
      grand_type: string
    }
  }
}
