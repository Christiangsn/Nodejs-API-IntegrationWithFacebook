import { IHttpResponse } from '../http'

export const NoContent = (): IHttpResponse => ({
  statusCode: 204,
  data: null
})
