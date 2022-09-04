/* eslint-disable @typescript-eslint/no-invalid-void-type */
import { IMiddleware } from '@app/middlewares'
import { getMockReq, getMockRes } from '@jest-mock/express'
import { ExpressMiddleware } from '@main/adapters/express.middleware'
import { NextFunction, Response, Request } from 'express'
import { mock, MockProxy } from 'jest-mock-extended'

describe('ExpressMiddleware', () => {
  let req: Request
  let res: Response
  let next: NextFunction
  let middleware: MockProxy<IMiddleware>
  let sut: ExpressMiddleware

  beforeEach(() => {
    req = getMockReq({ headers: { any: 'any' } })
    res = getMockRes().res
    next = getMockRes().next
    middleware = mock<IMiddleware>()
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
