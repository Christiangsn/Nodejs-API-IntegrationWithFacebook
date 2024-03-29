import { ServerError } from '@app/errors/http'
import { IHttpResponse } from '../http'

export const InternalServerError = (error: Error): IHttpResponse<Error> => ({
  statusCode: 500,
  data: new ServerError(error)
})
