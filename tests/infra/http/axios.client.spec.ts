import { AxiosHttpClient } from '@infra/http'

import axios from 'axios'

jest.mock('axios')

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
    fakeAxios.get.mockResolvedValue({
      status: 200,
      data: 'any_data'
    })
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

    it('Should return data on success', async () => {
      const result = await sut.get({
        url,
        params
      })

      expect(result).toEqual('any_data')
    })

    it('Should rethrow  if ge throws', async () => {
      fakeAxios.get.mockRejectedValueOnce(new Error('Http Error Client'))

      const promise = sut.get({
        url,
        params
      })

      await expect(promise).rejects.toThrow(new Error('Http Error Client'))
    })
  })
})
