/* eslint-disable @typescript-eslint/no-invalid-void-type */
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

describe('ExpressMiddleware', () => {
  let req: Request
  let res: Response
  let next: NextFunction
  let middleware: MockProxy<Middleware>
  let sut: ExpressMiddleware

  beforeEach(() => {
    req = getMockReq({ headers: { any: 'any' } })
    res = getMockRes().res
    next = getMockRes().next
    middleware = mock<Middleware>()
    middleware.handle.mockResolvedValue({
      statusCode: 200,
      data: {
        emptyProp: '',
        nullProp: null,
        undefinedProp: undefined,
        prop: 'any_value'
      }
    })
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

  it('Should respond with correct error and statusCode', async () => {
    middleware.handle.mockResolvedValueOnce({
      statusCode: 500,
      data: {
        error: 'any_error'
      }
    })

    await sut.intercept(req, res, next)
    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.status).toHaveBeenCalledTimes(1)

    expect(res.json).toHaveBeenCalledWith({
      error: 'any_error'
    })
    expect(res.json).toHaveBeenCalledTimes(1)
  })

  it('Should add valid data to req.locals', async () => {
    await sut.intercept(req, res, next)
    expect(req.locals).toEqual({
      prop: 'any_value'
    })
    expect(next).toHaveBeenCalledTimes(1)
  })
})
