import { auth } from './../middlewares/auth'
/* eslint-disable @typescript-eslint/no-misused-promises */
import { ExpressRouter } from '@main/adapters/express.router'
import { makeFacebookLoginController } from '@main/factories/controllers/facebook/facebook-login'
import { Router } from 'express'

export default (router: Router): void => {
  const controller = makeFacebookLoginController()
  const adapter = new ExpressRouter(controller)

  router.delete('/users/picture', async (req, res, next) => auth.intercept(req, res, next), async (req, res) => adapter.adapt(req, res))
}
