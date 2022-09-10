import { IHttpResponse } from '../http'

export const NoContent = (): IHttpResponse => ({
  statusCode: 400,
  data: null
})
