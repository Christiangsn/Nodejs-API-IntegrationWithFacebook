import { JwtTokenHandler } from '@infra/crypto'
import jwt from 'jsonwebtoken'

jest.mock('jsonwebtoken')

describe('JwtTokenHandler', () => {
  let key: string
  let token: string
  let expirationInMs: number
  let secret: string

  let sut: JwtTokenHandler
  let fakeJwt: jest.Mocked<typeof jwt>

  beforeAll(() => {
    key = 'any_key'
    token = 'any_token'
    secret = 'any_secret'
    expirationInMs = 1000
    fakeJwt = jwt as jest.Mocked<typeof jwt>
  })

  beforeEach(() => {
    sut = new JwtTokenHandler(secret)
  })

  describe('GenerateToken', () => {
    beforeAll(() => {
      fakeJwt.sign.mockImplementation(() => token)
    })

    it('Should call sign with correct params', async () => {
      await sut.generation({ key, expirationInMs })
      expect(fakeJwt.sign).toHaveBeenCalledWith({ key }, secret, { expiresIn: 1 })
    })

    it('Should return a token', async () => {
      const generatedToken = await sut.generation({ key, expirationInMs })
      expect(generatedToken).toBe(token)
    })

    it('Should rethrow  if JWT Sign throws', async () => {
      fakeJwt.sign.mockImplementation(() => { throw new Error('Error in Generation Token') })

      const promise = sut.generation({ key, expirationInMs })
      await expect(promise).rejects.toThrow(new Error('Error in Generation Token'))
    })
  })
})
