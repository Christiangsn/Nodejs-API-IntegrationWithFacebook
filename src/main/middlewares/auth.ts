
import { ExpressMiddleware } from '@main/adapters/express.middleware'
import { makeAuthMiddleware } from '@main/factories/middlewares/auth'

export const auth = new ExpressMiddleware(makeAuthMiddleware())
