import { AcessToken } from '@domain/models'

describe('AcessToken', () => {
  it('should create with a value', () => {
    const sut = new AcessToken('0001_ANY_VALUE')

    expect(sut).toEqual({ value: '0001_ANY_VALUE' })
  })

  it('should expire in 1800000 ms', () => {
    expect(AcessToken.expirationInMs).toBe(1800000)
  })
})
