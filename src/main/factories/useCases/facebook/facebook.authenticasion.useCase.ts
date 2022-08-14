import { FacebookAuthenticationUseCases } from '@data/useCases/facebook'
import { makeFacebookAPI } from '@main/factories/apis/facebook/facebook.api'
import { makeJwtTokenGenerator } from '@main/factories/crypto/token.generator'
import { makeUserRepository } from '@main/factories/repository/user.repository'

export const makeFacebookAuthenticationUseCases = (): FacebookAuthenticationUseCases => {
  return new FacebookAuthenticationUseCases(makeFacebookAPI(), makeUserRepository(), makeJwtTokenGenerator())
}
