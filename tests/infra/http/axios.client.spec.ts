import { IHttpGetClient } from '@infra/http'

import axios from 'axios'

jest.mock('axios')

class AxiosHttpClient {
  async get ({ url, params }: IHttpGetClient.Params): Promise<void> {
    await axios.get(url, {
      params
    })
  }
}

describe('AxiosHttpClient', () => {
  let sut: AxiosHttpClient
  let fakeAxios: jest.Mocked<typeof axios>
  let url: string
  let params: Object

  beforeAll(() => {
    fakeAxios = axios as jest.Mocked<typeof axios>
    url = 'any_url'
    params = {
      any: 'any'
    }
  })

  beforeEach(() => {
    sut = new AxiosHttpClient()
  })

  describe('get', () => {
    it('Should call get with correct params', async () => {
      await sut.get({
        url,
        params
      })

      expect(fakeAxios.get).toHaveBeenCalledWith(url, {
        params
      })
      expect(fakeAxios.get).toHaveBeenCalledTimes(1)
    })
  })
})
