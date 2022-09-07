import { IUUIDGenerator } from '@domain/contracts/gateways'
import { v4 } from 'uuid'

export class UUIDHandler implements IUUIDGenerator {
  public uuid ({ key }: IUUIDGenerator.Input): IUUIDGenerator.Output {
    return `${key}_${v4()}`
  }
}
