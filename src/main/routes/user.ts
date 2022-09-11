import { auth } from './../middlewares/auth'
/* eslint-disable @typescript-eslint/no-misused-promises */
import { ExpressRouter } from '@main/adapters/express.router'
import { Router } from 'express'
import { makeDeleteProfilePictureController } from '@main/factories/controllers'

export default (router: Router): void => {
  const controller = makeDeleteProfilePictureController()
  const adapter = new ExpressRouter(controller)

  router.delete('/users/picture', async (req, res, next) => auth.intercept(req, res, next), async (req, res) => adapter.adapt(req, res))
}
