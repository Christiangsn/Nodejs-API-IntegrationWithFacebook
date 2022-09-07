import { IUUIDGenerator } from '@domain/contracts/gateways'
import { v4 } from 'uuid'

jest.mock('uuid')

class UUIDHandler {
  public uuid ({ key }: IUUIDGenerator.Input): IUUIDGenerator.Output {
    return `${key}_${v4()}`
  }
}

describe('UUIDHandler', () => {
  it('Should call uuid.v4', () => {
    const sut = new UUIDHandler()

    sut.uuid({ key: 'any_key' })

    expect(v4).toHaveBeenCalledTimes(1)
  })

  it('Should return correct uuid', () => {
    jest.mocked(v4).mockReturnValueOnce('any_uuid')
    const sut = new UUIDHandler()
    const uuid = sut.uuid({ key: 'any_key' })

    expect(uuid).toBe('any_key_any_uuid')
  })
})
