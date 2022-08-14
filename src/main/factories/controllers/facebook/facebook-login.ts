import { FacebookLoginController } from '@app/controllers/facebook/facebook.login'
import { makeFacebookAuthenticationUseCases } from '@main/factories/useCases/facebook/facebook.authenticasion.useCase'

export const makeFacebookLoginController = (): FacebookLoginController => {
  const facebookAuthUseCases = makeFacebookAuthenticationUseCases()
  return new FacebookLoginController(facebookAuthUseCases)
}
