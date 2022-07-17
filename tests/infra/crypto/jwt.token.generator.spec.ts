import { ITokenGeneration } from '@data/contracts/crypto'
import jwt from 'jsonwebtoken'

jest.mock('jsonwebtoken')

class JwtTokenGenerator {
  constructor (
    private readonly secret: string
  ) { }

  public async generation ({ key, expirationInMs }: ITokenGeneration.Params): Promise<ITokenGeneration.Return> {
    const expirationInSeconds = expirationInMs / 1000
    const generationToken = jwt.sign({
      key
    }, this.secret, { expiresIn: expirationInSeconds })

    return generationToken
  }
}

describe('JwtTokenGenerator', () => {
  let sut: JwtTokenGenerator
  let fakeJwt: jest.Mocked<typeof jwt>

  beforeAll(() => {
    fakeJwt = jwt as jest.Mocked<typeof jwt>
    fakeJwt.sign.mockImplementation(() => 'any_token')
  })

  beforeEach(() => {
    sut = new JwtTokenGenerator('any_secret')
  })

  it('Should call sign with correct params', async () => {
    await sut.generation({ key: 'any_key', expirationInMs: 1000 })
    expect(fakeJwt.sign).toHaveBeenCalledWith({ key: 'any_key' }, 'any_secret', { expiresIn: 1 })
  })

  it('Should return a token', async () => {
    const token = await sut.generation({ key: 'any_key', expirationInMs: 1000 })
    expect(token).toBe('any_token')
  })

  it('Should rethrow  if JWT Sign throws', async () => {
    fakeJwt.sign.mockImplementation(() => { throw new Error('Error in Generation Token') })

    const promise = sut.generation({ key: 'any_key', expirationInMs: 1000 })

    await expect(promise).rejects.toThrow(new Error('Error in Generation Token'))
  })
})
