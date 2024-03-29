/* eslint-disable @typescript-eslint/no-misused-promises */
import { ExpressRouter } from '@main/adapters/express.router'
import { makeFacebookLoginController } from '@main/factories/controllers/facebook/facebook-login'
import { Router } from 'express'

export default (router: Router): void => {
  const controller = makeFacebookLoginController()
  const adapter = new ExpressRouter(controller)
  router.post('/login/facebook', async (req, res) => adapter.adapt(req, res))
}
