import { UUIDHandler } from '@infra/crypto/uui.handler'

export const makeUUIDHandler = (): UUIDHandler => {
  return new UUIDHandler()
}
