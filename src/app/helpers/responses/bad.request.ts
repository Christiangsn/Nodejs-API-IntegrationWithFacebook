import { IHttpResponse } from '../http'

export const BadRequest = (error: Error): IHttpResponse<Error> => ({
  statusCode: 400,
  data: error
})
