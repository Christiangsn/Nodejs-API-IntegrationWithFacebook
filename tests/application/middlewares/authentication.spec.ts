import { RequiredStringValidator } from '@app/validators'
import { ForbiddenError } from '@app/errors/http'
import { IHttpResponse } from '@app/helpers/http'
import { Fobidden } from '@app/helpers/responses'
import { IAuthorize } from '@domain/features/auth'
import { MockProxy, mock } from 'jest-mock-extended'

type IHttpRequest = {
  authorization: string
}

export class AuthenticationMiddleware {
  constructor (
    private readonly authorize: IAuthorize
  ) { }

  public async handle ({ authorization }: IHttpRequest): Promise<IHttpResponse<Error> | undefined> {
    const error = new RequiredStringValidator(authorization, 'authorization').validate()

    try {
      if (error !== undefined) {
        return Fobidden()
      }

      await this.authorize.auth({ token: authorization })
    } catch (error) {
      return Fobidden()
    }
  }
}

describe('AuthenticationMiddleware', () => {
  let sut: AuthenticationMiddleware
  let authorize: MockProxy<IAuthorize>
  let authorization: string

  beforeEach(() => {
    authorization = 'any_authorization_token'
  })

  beforeAll(() => {
    authorize = mock()
    sut = new AuthenticationMiddleware(authorize)
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

  it('Should call authorize with correct input', async () => {
    await sut.handle({ authorization })

    expect(authorize.auth).toHaveBeenCalledWith({ token: authorization })
    expect(authorize.auth).toHaveBeenCalledTimes(1)
  })

  it('Should return 403 if authorize throws', async () => {
    authorize.auth.mockRejectedValueOnce(new Error('any_error'))
    const httpResponse = await sut.handle({ authorization })

    expect(httpResponse).toEqual({
      statusCode: 403,
      data: new ForbiddenError()
    })
  })
})
