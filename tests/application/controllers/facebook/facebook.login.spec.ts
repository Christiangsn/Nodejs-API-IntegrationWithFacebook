import { AccessToken } from '@domain/models'
import { TAuthenticationError } from '@domain/error'
import { IFacebookAuth } from '@domain/contracts'
import { mock, MockProxy } from 'jest-mock-extended'
import { FacebookLoginController } from '@app/controllers/facebook/facebook.login'
import { ServerError } from '@app/errors/http'
import { AnauthorizedError } from '@app/errors/http.anauthorized'
import { RequiredStringValidator, ValidationComposite } from '@app/validators'

jest.mock('@app/validators/composite')

describe('FacebookLoginController', () => {
  let FacebookAuthenticationUseCases: MockProxy<IFacebookAuth>
  let sut: FacebookLoginController
  let token: string

  beforeAll(() => {
    token = 'any_token'
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
  it('should return 400 if validation fails', async () => {
    const error = new Error('Validated is fails')
    const ValidationCompositeSpy = jest.fn().mockImplementationOnce(() => ({
      validate: jest.fn().mockReturnValue(error)
    }))
    jest.mocked(ValidationComposite).mockImplementationOnce(ValidationCompositeSpy)

    const logon = await sut.run({ token })

    expect(ValidationComposite).toHaveBeenCalledWith([
      new RequiredStringValidator('any_token', 'token')
    ])
    expect(logon).toEqual({
      statusCode: 400,
      data: error
    })
  })

  // Chamar o caso de uso do facebook authentication
  it('should call FacebookAuthenticationUseCases with correct params', async () => {
    await sut.run({ token })
    expect(FacebookAuthenticationUseCases.execute).toHaveBeenCalledWith({ token })
    expect(FacebookAuthenticationUseCases.execute).toHaveBeenCalledTimes(1)
  })

  // Se a authenticação falhar
  it('should return 401 if token fails', async () => {
    // MOCK DE ERRO
    FacebookAuthenticationUseCases.execute.mockResolvedValueOnce(new TAuthenticationError())

    const logon = await sut.run({ token })
    expect(logon).toEqual({
      statusCode: 401,
      data: new AnauthorizedError()
    })
  })

  // Caso for sucesso retornar o token de acesso
  it('should return 200 if authentication is successful', async () => {
    const logon = await sut.run({ token })
    expect(logon).toEqual({
      statusCode: 200,
      data: {
        accessToken: 'any_value'
      }
    })
  })

  // Caso estourar um erro na camadas
  it('should return 500 throw exception', async () => {
    const error = new Error('infra_error')
    // MOCK DE ERRO
    FacebookAuthenticationUseCases.execute.mockRejectedValueOnce(error)

    const logon = await sut.run({ token })
    expect(logon).toEqual({
      statusCode: 500,
      data: new ServerError(error)
    })
  })
})
