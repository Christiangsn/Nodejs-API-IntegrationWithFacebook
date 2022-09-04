import { RequiredStringValidator } from '@app/validators'
import { ForbiddenError } from '@app/errors/http'
import { IHttpResponse } from '@app/helpers/http'
import { Fobidden, Success } from '@app/helpers/responses'
import { IAuthorize } from '@domain/features/auth'
import { MockProxy, mock } from 'jest-mock-extended'

type IHttpRequest = {
  authorization: string
}

type Model = Error | { userId: string }

export class AuthenticationMiddleware {
  constructor (
    private readonly authorize: IAuthorize
  ) { }

  public async handle ({ authorization }: IHttpRequest): Promise<IHttpResponse<Model> > {
    const error = new RequiredStringValidator(authorization, 'authorization').validate()

    try {
      if (error !== undefined) {
        return Fobidden()
      }

      const userId = await this.authorize.auth({ token: authorization })
      return Success({ userId })
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
