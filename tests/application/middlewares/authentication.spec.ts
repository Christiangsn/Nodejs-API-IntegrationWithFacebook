import { ForbiddenError } from '@app/errors/http'
import { IHttpResponse } from '@app/helpers/http'
import { Fobidden } from '@app/helpers/responses'

type IHttpRequest = {
  authorization: string
}

export class AuthenticationMiddleware {
  public async handle (httpRequest: IHttpRequest): Promise<IHttpResponse<Error>> {
    return Fobidden()
  }
}

describe('AuthenticationMiddleware', () => {
  let sut: AuthenticationMiddleware

  beforeEach(() => {
    sut = new AuthenticationMiddleware()
  })

  it('Should return 403 if authorization is empty', async () => {
    const httpResponse = await sut.handle({ authorization: '' })

    expect(httpResponse).toEqual({
      statusCode: 403,
      data: new ForbiddenError()
    })
  })

  it('Should return 403 if authorization is null', async () => {
    const httpResponse = await sut.handle({ authorization: null as any })

    expect(httpResponse).toEqual({
      statusCode: 403,
      data: new ForbiddenError()
    })
  })

  it('Should return 403 if authorization is undefined', async () => {
    const httpResponse = await sut.handle({ authorization: undefined as any })

    expect(httpResponse).toEqual({
      statusCode: 403,
      data: new ForbiddenError()
    })
  })
})
