import { ForbiddenError } from '@app/errors/http'
import { AuthenticationMiddleware } from '@app/middlewares'
import { IAuthorize } from '@domain/features/auth'
import { MockProxy, mock } from 'jest-mock-extended'

describe('AuthenticationMiddleware', () => {
  let sut: AuthenticationMiddleware
  let authorize: MockProxy<IAuthorize>
  let authorization: string

  beforeEach(() => {
    authorization = 'any_authorization_token'
  })

  beforeAll(() => {
    authorize = mock()
    authorize.auth.mockResolvedValue('any_user_id')
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

  it('Should return 200 with userId on success', async () => {
    const httpResponse = await sut.handle({ authorization })

    expect(httpResponse).toEqual({
      statusCode: 200,
      data: {
        userId: 'any_user_id'
      }
    })
  })
})
