import { FacebookAPI } from '@infra/api'
import { env } from '@main/config/env'

import { makeAxiosHttpClient } from '@main/factories/http/axios.client'

export const makeFacebookAPI = (): FacebookAPI => {
  const axiosClient = makeAxiosHttpClient()
  return new FacebookAPI(axiosClient, env.facebookApi.clientId, env.facebookApi.clientSecret)
}
