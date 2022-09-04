import { IHttpResponse } from '@app/helpers/http'
import { getMockReq, getMockRes } from '@jest-mock/express'
import { NextFunction, Response, Request } from 'express'
import { mock, MockProxy } from 'jest-mock-extended'

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
  let req: Request
  let res: Response
  let next: NextFunction
  let middleware: MockProxy<Middleware>
  let sut: ExpressMiddleware

  beforeAll(() => {
    req = getMockReq({ headers: { any: 'any' } })
    res = getMockRes().res
    next = getMockRes().next
  })

  beforeEach(() => {
    middleware = mock<Middleware>()
    sut = new ExpressMiddleware(middleware)
  })

  it('Should call handle with correct request', async () => {
    await sut.intercept(req, res, next)
    expect(middleware.handle).toHaveBeenCalledWith({ any: 'any' })
    expect(middleware.handle).toHaveBeenCalledTimes(1)
  })

  it('Should call handle with empty request', async () => {
    req = getMockReq()

    await sut.intercept(req, res, next)
    expect(middleware.handle).toHaveBeenCalledWith({})
    expect(middleware.handle).toHaveBeenCalledTimes(1)
  })
})
