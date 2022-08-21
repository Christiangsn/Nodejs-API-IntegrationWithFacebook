import { IHttpGetClient } from './http.client'

import axios from 'axios'

export class AxiosHttpClient implements IHttpGetClient {
  async get ({ url, headers, params }: IHttpGetClient.Params): Promise<any> {
    const result = await axios.get(url, {
      data: '',
      params,
      headers
    })

    return result.data
  }
}
