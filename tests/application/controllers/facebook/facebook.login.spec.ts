import { AccessToken } from '@domain/models'
/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { TAuthenticationError } from '@domain/error'
import { IFacebookAuth } from '@domain/contracts'
import { mock, MockProxy } from 'jest-mock-extended'

type IHttpResponse = { statusCode: number, data: any}

class FacebookLoginController {
  constructor (
    private readonly facebookAuthenticationUseCases: IFacebookAuth
  ) {}

  public async run (httpRequest: any): Promise<IHttpResponse> {
    try {
      if (httpRequest.token === '' || httpRequest.token === null || httpRequest.token === undefined) {
        return {
          statusCode: 400,
          data: new Error('The field token is required')
        }
      }

      // Retorno do result pode ser o token ou um erro
      const result = await this.facebookAuthenticationUseCases.execute({ token: httpRequest.token })

      // Ser for uma instance de um token liberar acesso
      if (result instanceof AccessToken) {
        return {
          statusCode: 200,
          data: {
            acessToken: result.value
          }
        }
      }

      // Default caso não conseguir processar as regras de cima como erro
      return {
        statusCode: 401,
        data: result
      }
    } catch (err) {
      return {
        statusCode: 500,
        data: new ServerError(err as Error)
      }
    }
  }
}

class ServerError extends Error {
  constructor (
    error?: Error
  ) {
    super('Internal Server Error')
    this.name = 'Server Error'
    this.stack = error?.stack
  }
}

describe('FacebookLoginController', () => {
  let FacebookAuthenticationUseCases: MockProxy<IFacebookAuth>
  let sut: FacebookLoginController

  beforeAll(() => {
    // Mockar a interface do caso de uso
    FacebookAuthenticationUseCases = mock()
    // Mockar o retorno de sucesso
    FacebookAuthenticationUseCases.execute.mockResolvedValue(new AccessToken('any_value'))
  })

  beforeEach(() => {
    jest.clearAllMocks()

    sut = new FacebookLoginController(FacebookAuthenticationUseCases)
  })

  // Se o token do facebook for vazio
  it('should return 400 if token is empty', async () => {
    const logon = await sut.run({ token: '' })
    expect(logon).toEqual({
      statusCode: 400,
      data: new Error('The field token is required')
    })
  })

  // Se o token do facebook for null
  it('should return 400 if token is null', async () => {
    const logon = await sut.run({ token: null })
    expect(logon).toEqual({
      statusCode: 400,
      data: new Error('The field token is required')
    })
  })

  // Se o token do facebook for undefined
  it('should return 400 if token is undefined', async () => {
    const logon = await sut.run({ token: undefined })
    expect(logon).toEqual({
      statusCode: 400,
      data: new Error('The field token is required')
    })
  })

  // Chamar o caso de uso do facebook authentication
  it('should call FacebookAuthenticationUseCases with correct params', async () => {
    await sut.run({ token: 'any_token' })
    expect(FacebookAuthenticationUseCases.execute).toHaveBeenCalledWith({ token: 'any_token' })
    expect(FacebookAuthenticationUseCases.execute).toHaveBeenCalledTimes(1)
  })

  // Se a authenticação falhar
  it('should return 400 if token fails', async () => {
    // MOCK DE ERRO
    FacebookAuthenticationUseCases.execute.mockResolvedValueOnce(new TAuthenticationError())

    const logon = await sut.run({ token: 'any_token' })
    expect(logon).toEqual({
      statusCode: 401,
      data: new TAuthenticationError()
    })
  })

  // Caso for sucesso retornar o token de acesso
  it('should return 200 if authentication is successful', async () => {
    const logon = await sut.run({ token: 'any_token' })
    expect(logon).toEqual({
      statusCode: 200,
      data: {
        acessToken: 'any_value'
      }
    })
  })

  // Caso estourar um erro na camadas
  it('should return 400 if token fails', async () => {
    const error = new Error('infra_error')
    // MOCK DE ERRO
    FacebookAuthenticationUseCases.execute.mockRejectedValueOnce(error)

    const logon = await sut.run({ token: 'any_token' })
    expect(logon).toEqual({
      statusCode: 500,
      data: new ServerError(error)
    })
  })
})
