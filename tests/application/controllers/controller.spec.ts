import { ServerError } from '@app/errors/http'
import { ValidationComposite } from '@app/validators'
import { Controller } from '@app/controllers/controller'
import { IHttpResponse } from '@app/helpers/http'

jest.mock('@app/validators/composite')

class ControlerStub extends Controller {
  public result: IHttpResponse = {
    statusCode: 200,
    data: 'any_data'
  }

  public async execute (httpRequest: any): Promise<IHttpResponse> {
    return this.result
  }
}

describe('Controller', () => {
  let sut: ControlerStub
  beforeEach(() => {
    jest.clearAllMocks()

    sut = new ControlerStub()
  })

  // Se o token do facebook for vazio
  it('should return 400 if validation fails', async () => {
    const error = new Error('Validated is fails')
    const ValidationCompositeSpy = jest.fn().mockImplementationOnce(() => ({
      validate: jest.fn().mockReturnValue(error)
    }))
    jest.mocked(ValidationComposite).mockImplementationOnce(ValidationCompositeSpy)

    const logon = await sut.run('any_value')

    expect(ValidationComposite).toHaveBeenCalledWith([])
    expect(logon).toEqual({
      statusCode: 400,
      data: error
    })
  })

  // Caso estourar um erro na camadas
  it('should return 500 if execute throw exception', async () => {
    const error = new Error('execute error')
    jest.spyOn(sut, 'execute').mockRejectedValueOnce(error)

    const logon = await sut.run('any_value')
    expect(logon).toEqual({
      statusCode: 500,
      data: new ServerError(error)
    })
  })

  // Garantir que a classe herdada vai chamar os metodos genericos
  it('Should return same result as execute', async () => {
    const logon = await sut.run('any_value')
    expect(logon).toEqual(sut.result)
  })
})
