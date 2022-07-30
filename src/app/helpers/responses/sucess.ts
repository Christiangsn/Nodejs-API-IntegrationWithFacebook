import { IHttpResponse } from '../http'

export const Success = <T = any> (data: T): IHttpResponse<T> => ({
  statusCode: 200,
  data
})
