import { ServerError } from '@app/errors'
import { IHttpResponse } from '../http'

export const InternalServerError = (error: Error): IHttpResponse => ({
  statusCode: 401,
  data: new ServerError(error)
})
