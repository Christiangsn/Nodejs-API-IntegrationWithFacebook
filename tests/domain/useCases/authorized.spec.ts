
import { ITokenValidator } from '@domain/contracts/crypto'
import { IAuthorize } from '@domain/features/auth'
import { AuthorizedByToken } from '@domain/useCases/auth/authorized'
import { mock, MockProxy } from 'jest-mock-extended'

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
