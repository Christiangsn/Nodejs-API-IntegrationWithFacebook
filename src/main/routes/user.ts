import { auth } from './../middlewares/auth'
/* eslint-disable @typescript-eslint/no-misused-promises */
import { ExpressRouter } from '@main/adapters/express.router'
import { Router } from 'express'
import { makeSaveProfilePictureController } from '@main/factories/controllers'
import { adaptMulter } from '@main/adapters/multer.adapter'

export default (router: Router): void => {
  const controller = makeSaveProfilePictureController()
  const adapter = new ExpressRouter(controller)

  router.delete('/users/picture', async (req, res, next) => auth.intercept(req, res, next), async (req, res) => adapter.adapt(req, res))
  router.put('/users/picture', async (req, res, next) => auth.intercept(req, res, next), adaptMulter, async (req, res) => adapter.adapt(req, res))
}
