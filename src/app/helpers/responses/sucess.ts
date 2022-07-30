import { IHttpResponse } from '../http'

export const Success = (data: any): IHttpResponse => ({
  statusCode: 200,
  data
})
