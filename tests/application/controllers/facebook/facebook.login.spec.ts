import { Controller } from '@app/controllers/controller'
import { AccessToken } from '@domain/entities'
import { TAuthenticationError } from '@domain/entities/error'
import { IFacebookAuth } from '@domain/features'
import { mock, MockProxy } from 'jest-mock-extended'
import { FacebookLoginController } from '@app/controllers/facebook/facebook.login'
import { AnauthorizedError } from '@app/errors/http/http.anauthorized'
import { RequiredString } from '@app/validators'

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

  it('Should extend Controler', async () => {
    expect(sut).toBeInstanceOf(Controller)
  })

  // Se o token do facebook for vazio
  it('should build validators correctly', async () => {
    const validators = sut.builderValidators({ token })

    expect(validators).toEqual([
      new RequiredString('any_token', 'token')
    ])
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
})
