import { AccessToken } from '@domain/entities'

describe('AcessToken', () => {
  it('should create with a value', () => {
    const sut = new AccessToken('0001_ANY_VALUE')

    expect(sut).toEqual({ value: '0001_ANY_VALUE' })
  })

  it('should expire in 1800000 ms', () => {
    expect(AccessToken.expirationInMs).toBe(1800000)
  })
})
