
import { mock, MockProxy } from 'jest-mock-extended'

export interface ITokenValidator {
    validate: (params: ITokenValidator.Params) => Promise<string>
}

export namespace ITokenValidator {
    export type Params = { token: string}
}

export interface IAuthorize {
    auth: (params: { token: string }) => Promise<string>
}

export class AuthorizedByToken implements IAuthorize {

    constructor (
        private readonly cryptography: ITokenValidator
    ) { }

    public async auth (params: { token: string }): Promise<string> {
        const key = await this.cryptography.validate({ token: params.token})
        return key
    }

}

describe('Authorized', () => {
  let cryptography: MockProxy<ITokenValidator>
  let sut: IAuthorize

  const token = 'any_token'

  beforeAll(() => {
    cryptography = mock()
    cryptography.validate.mockResolvedValue('any_id')
  })

  beforeEach(() => {
    jest.clearAllMocks()

    sut = new AuthorizedByToken(cryptography)
  })

  it('Should call tokenValidator with correct params', async () => {
    await sut.auth({ token })

    expect(cryptography.validate).toHaveBeenCalledWith({ token })
    expect(cryptography.validate).toHaveBeenCalledTimes(1)
  })

  it('Should return the correct params', async () => {
    const userId = await sut.auth({ token })

    expect(userId).toBe('any_id')
  })



})
