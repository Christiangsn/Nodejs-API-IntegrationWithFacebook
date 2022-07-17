import { ITokenGeneration } from '@data/contracts/crypto'
import jwt from 'jsonwebtoken'

jest.mock('jsonwebtoken')

class JwtTokenGenerator {
  constructor (
    private readonly secret: string
  ) { }

  public async generation ({ key, expirationInMs }: ITokenGeneration.Params): Promise<void> {
    const expirationInSeconds = expirationInMs / 1000
    jwt.sign({
      key
    }, this.secret, { expiresIn: expirationInSeconds })
  }
}

describe('JwtTokenGenerator', () => {
  it('Should call sign with correct params', async () => {
    const fakeJwt = jwt as jest.Mocked<typeof jwt>
    const sut = new JwtTokenGenerator('any_secret')

    await sut.generation({ key: 'any_key', expirationInMs: 1000 })
    expect(fakeJwt.sign).toHaveBeenCalledWith({ key: 'any_key' }, 'any_secret', { expiresIn: 1 })
  })
})
