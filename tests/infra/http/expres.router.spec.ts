import { Request, Response } from 'express'
import { getMockReq, getMockRes } from '@jest-mock/express'
import { mock, MockProxy } from 'jest-mock-extended'
import { Controller } from '@app/controllers/controller'

class ExpressRouter {
  constructor (
    private readonly controller: Controller
  ) { }

  public async adapt (req: Request, res: Response): Promise<void> {
    const httpResponse = await this.controller.run({ ...req.body })
    res.status(200).json(httpResponse.data)
  }
}

describe('ExpressRouter', () => {
  let req: Request
  let res: Response
  let controller: MockProxy<Controller>
  let sut: ExpressRouter

  beforeEach(() => {
    req = getMockReq({ body: { any: 'any' } })
    res = getMockRes().res
    controller = mock()
    controller.run.mockResolvedValueOnce({
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
      statusCode: 200,
      data: {
        any: 'any'
      }
    })
    await sut.adapt(req, res)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.status).toHaveBeenCalledTimes(1)
  })
})
