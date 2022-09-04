import { ForbiddenError } from '@app/errors/http'
import { IHttpResponse } from '../http'

export const Fobidden = (): IHttpResponse<Error> => ({
  statusCode: 403,
  data: new ForbiddenError()
})
