import { ServerError } from '@app/errors'
import { IHttpResponse } from '../http'

export const InternalServerError = (error: Error): IHttpResponse => ({
  statusCode: 500,
  data: new ServerError(error)
})
