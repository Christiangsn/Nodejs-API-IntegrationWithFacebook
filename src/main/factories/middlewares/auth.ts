import { AuthenticationMiddleware } from '@app/middlewares'
import { AuthorizedByToken } from '@domain/useCases/auth/authorized'
import { makeJwtTokenHandler } from '../crypto/token.generator'

export const makeAuthMiddleware = (): AuthenticationMiddleware => {
  const authorized = new AuthorizedByToken(makeJwtTokenHandler())
  return new AuthenticationMiddleware(authorized)
}
