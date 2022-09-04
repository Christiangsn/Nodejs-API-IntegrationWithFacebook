import { getMockReq, getMockRes } from '@jest-mock/express'
import { mock, MockProxy } from 'jest-mock-extended'
import { Request, Response } from 'express'
import { Controller } from '@app/controllers/controller'
import { ExpressRouter } from '@main/adapters/express.router'

describe('ExpressRouter', () => {
  let req: Request
  let res: Response
  let controller: MockProxy<Controller>
  let sut: ExpressRouter

  beforeEach(() => {
    req = getMockReq({ body: { any: 'any' } })
    res = getMockRes().res
    controller = mock()
    controller.run.mockResolvedValue({
      statusCode: 200,
      data: {
        any: 'any'
      }
    })
    sut = new ExpressRouter(controller)
  })

  it('Should call handle with correct requert', async () => {
    await sut.adapt(req, res)

    expect(controller.run).toHaveBeenCalledWith({ any: 'any' })
    expect(controller.run).toHaveBeenCalledTimes(1)
  })

  it('Should call handle with empty request', async () => {
    const req = getMockReq()
    await sut.adapt(req, res)

    expect(controller.run).toHaveBeenCalledWith({})
    expect(controller.run).toHaveBeenCalledTimes(1)
  })

  it('Should respond wuith 200 and valid data', async () => {
    const req = getMockReq()
    await sut.adapt(req, res)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.status).toHaveBeenCalledTimes(1)
    expect(res.json).toHaveBeenCalledWith({
      any: 'any'
    })
    expect(res.json).toHaveBeenCalledTimes(1)
  })

  it('Should respond wuith 400 and valid error', async () => {
    const req = getMockReq()
    controller.run.mockResolvedValueOnce({
      statusCode: 400,
      data: new Error('any error')
    })

    await sut.adapt(req, res)
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.status).toHaveBeenCalledTimes(1)
    expect(res.json).toHaveBeenCalledWith({ error: 'any error' })
    expect(res.json).toHaveBeenCalledTimes(1)
  })
})
