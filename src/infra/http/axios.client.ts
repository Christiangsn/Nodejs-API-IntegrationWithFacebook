import { IHttpGetClient } from './http.client'

import axios from 'axios'

export class AxiosHttpClient implements IHttpGetClient {
  async get <T = any> (params: IHttpGetClient.Params): Promise<T> {
    const result = await axios.get(params.url, {
      data: '',
      params: params.params,
      headers: params.headers
    })

    return result.data
  }
}
