import { IHttpGetClient } from './http.client'

import axios from 'axios'

export class AxiosHttpClient implements IHttpGetClient {
  async get <T = any> ({ url, params }: IHttpGetClient.Params): Promise<T> {
    const result = await axios.get(url, {
      params
    })
    return result.data
  }
}
