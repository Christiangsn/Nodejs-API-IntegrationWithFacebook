/* eslint-disable @typescript-eslint/no-invalid-void-type */
import { NextFunction, Response, Request } from 'express'

import { IMiddleware } from '@app/middlewares'

export class ExpressMiddleware {
  constructor (
    private readonly expressMiddleware: IMiddleware
  ) { }

  public async intercept (req: Request, res: Response, next: NextFunction): Promise<void | Response> {
    const { statusCode, data } = await this.expressMiddleware.handle({ ...req.headers })
    if (statusCode === 200) {
      const entries = Object.entries(data).filter((entry) => entry[1])
      req.locals = { ...req.locals, ...Object.fromEntries(entries) }
      return next()
    }
    return res.status(statusCode).json(data)
  }
}
