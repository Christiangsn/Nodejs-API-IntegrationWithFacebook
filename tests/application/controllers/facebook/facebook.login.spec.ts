import { AccessToken } from '@domain/models'
import { TAuthenticationError } from '@domain/error'
import { IFacebookAuth } from '@domain/contracts'
import { mock, MockProxy } from 'jest-mock-extended'
import { FacebookLoginController } from '@app/controllers/facebook/facebook.login'
import { ServerError } from '@app/errors/http'
import { RequiredFieldError } from '@app/errors'

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
      data: new RequiredFieldError('token')
    })
  })

  // Se o token do facebook for null
  it('should return 400 if token is null', async () => {
    const logon = await sut.run({ token: null })
    expect(logon).toEqual({
      statusCode: 400,
      data: new RequiredFieldError('token')
    })
  })

  // Se o token do facebook for undefined
  it('should return 400 if token is undefined', async () => {
    const logon = await sut.run({ token: undefined })
    expect(logon).toEqual({
      statusCode: 400,
      data: new RequiredFieldError('token')
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
