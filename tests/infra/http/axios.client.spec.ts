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
  describe('get', () => {
    it('Should call get with correct params', async () => {
      const fakeAxios = axios as jest.Mocked<typeof axios>
      const sut = new AxiosHttpClient()

      await sut.get({
        url: 'any_url',
        params: {
          any: 'any'
        }
      })

      expect(fakeAxios.get).toHaveBeenCalledWith('any_url', {
        params: {
          any: 'any'
        }
      })
      expect(fakeAxios.get).toHaveBeenCalledTimes(1)
    })
  })
})
