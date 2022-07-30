import { IHttpResponse } from '../http'

export const BadRequest = (error: Error): IHttpResponse => ({
  statusCode: 400,
  data: error
})
