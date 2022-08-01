/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { AxiosHttpClient } from '@infra/http'

import axios, { AxiosRequestHeaders } from 'axios'

jest.mock('axios')

describe('AxiosHttpClient', () => {
  let sut: AxiosHttpClient
  let fakeAxios: jest.Mocked<typeof axios>
  let url: string
  let headers: AxiosRequestHeaders
  let params: Object
  let data: string | Object

  beforeAll(() => {
    fakeAxios = axios as jest.Mocked<typeof axios>
    url = 'any_url'
    headers = {
      'Content-Type': 'application/json'
    }
    data = ''
    fakeAxios.get.mockResolvedValue({
      status: 200,
      data: 'any_data'
    })
  })

  beforeEach(() => {
    jest.clearAllMocks()
    sut = new AxiosHttpClient()
  })

  describe('get', () => {
    it('Should call get with correct params', async () => {
      await sut.get({ url, params: undefined, headers })

      expect(fakeAxios.get).toHaveBeenCalledWith(url, {
        params: undefined,
        data,
        headers
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
