
import { mock, MockProxy } from 'jest-mock-extended'

export interface ITokenValidator {
    validate: (params: ITokenValidator.Params) => Promise<void>
}

export namespace ITokenValidator {
    export type Params = { token: string}
}

export interface IAuthorize {
    auth: (params: { token: string }) => Promise<void>
}

export class AuthorizedByToken implements IAuthorize {

    constructor (
        private readonly cryptography: ITokenValidator
    ) { }

    public async auth (params: { token: string }): Promise<void> {
        await this.cryptography.validate({ token: params.token})
    }

}

describe('Authorized', () => {
  let cryptography: MockProxy<ITokenValidator>
  let sut: IAuthorize

  const token = 'any_token'

  beforeAll(() => {
    cryptography = mock()
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



})
