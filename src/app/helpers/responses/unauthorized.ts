import { AnauthorizedError } from '@app/errors/http/http.anauthorized'
import { IHttpResponse } from '../http'

export const Anauthorized = (): IHttpResponse<Error> => ({
  statusCode: 401,
  data: new AnauthorizedError()
})
