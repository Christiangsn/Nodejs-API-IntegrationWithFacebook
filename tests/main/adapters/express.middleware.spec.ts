import { IHttpResponse } from '@app/helpers/http'
import { getMockReq, getMockRes } from '@jest-mock/express'
import { NextFunction, Response, Request } from 'express'
import { mock } from 'jest-mock-extended'

interface Middleware {
  handle: (httpRequest: any) => Promise<IHttpResponse>
}

export class ExpressMiddleware {
  constructor (
    private readonly expressMiddleware: Middleware
  ) { }

  public async intercept (req: Request, res: Response, next: NextFunction): Promise<void> {
    await this.expressMiddleware.handle({ ...req.headers })
  }
}

describe('ExpressMiddleware', () => {
  it('Should call handle with correct request', async () => {
    const req = getMockReq({ headers: { any: 'any' } })
    const res = getMockRes().res
    const next = getMockRes().next

    const middleware = mock<Middleware>()
    const sut = new ExpressMiddleware(middleware)

    await sut.intercept(req, res, next)
    expect(middleware.handle).toHaveBeenCalledWith({ any: 'any' })
    expect(middleware.handle).toHaveBeenCalledTimes(1)
  })

  it('Should call handle with empty request', async () => {
    const req = getMockReq({ })
    const res = getMockRes().res
    const next = getMockRes().next

    const middleware = mock<Middleware>()
    const sut = new ExpressMiddleware(middleware)

    await sut.intercept(req, res, next)
    expect(middleware.handle).toHaveBeenCalledWith({})
    expect(middleware.handle).toHaveBeenCalledTimes(1)
  })
})
