export type IHttpResponse<T = any> = {
  statusCode: number
  data: T
}
