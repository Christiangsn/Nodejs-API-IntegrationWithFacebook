import { IFacebookAuth } from '@domain/contracts'
import { mock } from 'jest-mock-extended'

type IHttpResponse = { statusCode: number, data: any}

class FacebookLoginController {
  constructor (
    private readonly facebookAuthenticationUseCases: IFacebookAuth
  ) {}

  async run (httpRequest: any): Promise<IHttpResponse> {
    await this.facebookAuthenticationUseCases.execute({ token: httpRequest.token })
    return {
      statusCode: 400,
      data: new Error('The field token is required')
    }
  }
}

describe('FacebookLoginController', () => {
  // Se o token do facebook for vazio
  it('should return 400 if token is empty', async () => {
    // Mockar a interface do caso de uso
    const FacebookAuthenticationUseCases = mock<IFacebookAuth>()
    const sut = new FacebookLoginController(FacebookAuthenticationUseCases)

    const logon = await sut.run({ token: '' })
    expect(logon).toEqual({
      statusCode: 400,
      data: new Error('The field token is required')
    })
  })

  // Se o token do facebook for null
  it('should return 400 if token is null', async () => {
    // Mockar a interface do caso de uso
    const FacebookAuthenticationUseCases = mock<IFacebookAuth>()
    const sut = new FacebookLoginController(FacebookAuthenticationUseCases)
    const logon = await sut.run({ token: null })
    expect(logon).toEqual({
      statusCode: 400,
      data: new Error('The field token is required')
    })
  })

  // Se o token do facebook for undefined
  it('should return 400 if token is undefined', async () => {
    // Mockar a interface do caso de uso
    const FacebookAuthenticationUseCases = mock<IFacebookAuth>()
    const sut = new FacebookLoginController(FacebookAuthenticationUseCases)

    const logon = await sut.run({ token: undefined })
    expect(logon).toEqual({
      statusCode: 400,
      data: new Error('The field token is required')
    })
  })

  // Chamar o caso de uso do facebook authentication
  it('should call FacebookAuthenticationUseCases with correct params', async () => {
    // Mockar a interface do caso de uso
    const FacebookAuthenticationUseCases = mock<IFacebookAuth>()
    const sut = new FacebookLoginController(FacebookAuthenticationUseCases)

    await sut.run({ token: 'any_token' })
    expect(FacebookAuthenticationUseCases.execute).toHaveBeenCalledWith({ token: 'any_token' })
    expect(FacebookAuthenticationUseCases.execute).toHaveBeenCalledTimes(1)
  })
})
