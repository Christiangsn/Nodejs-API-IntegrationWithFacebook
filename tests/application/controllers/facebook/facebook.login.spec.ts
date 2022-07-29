
type IHttpResponse = { statusCode: number, data: any}

class FacebookLoginController {
  async run (httpRequest: any): Promise<IHttpResponse> {
    return {
      statusCode: 400,
      data: new Error('The field token is required')
    }
  }
}

describe('FacebookLoginController', () => {
  // Se o token do facebook for vazio
  it('should return 400 if token is empty', async () => {
    const sut = new FacebookLoginController()

    const logon = await sut.run({ token: '' })
    expect(logon).toEqual({
      statusCode: 400,
      data: new Error('The field token is required')
    })
  })

  // Se o token do facebook for null
  it('should return 400 if token is null', async () => {
    const sut = new FacebookLoginController()

    const logon = await sut.run({ token: null })
    expect(logon).toEqual({
      statusCode: 400,
      data: new Error('The field token is required')
    })
  })
})
