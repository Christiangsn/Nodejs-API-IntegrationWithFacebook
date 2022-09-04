import { IHttpResponse } from '@app/helpers/http'

export interface IMiddleware {
  handle: (httpRequest: any) => Promise<IHttpResponse>
}
