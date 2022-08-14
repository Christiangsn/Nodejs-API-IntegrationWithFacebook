import { Request, Response } from 'express'
import { getMockReq, getMockRes } from '@jest-mock/express'
import { mock, MockProxy } from 'jest-mock-extended'
import { Controller } from '@app/controllers/controller'

class ExpressRouter {
  constructor (
    private readonly controller: Controller
  ) { }

  public async adapt (req: Request, res: Response): Promise<void> {
    await this.controller.run({ ...req.body })
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
    sut = new ExpressRouter(controller)
  })

  it('Should call handle with correct requert', async () => {
    await sut.adapt(req, res)

    expect(controller.run).toHaveBeenCalledWith({ any: 'any' })
  })

  it('Should call handle with empty request', async () => {
    const req = getMockReq()
    await sut.adapt(req, res)

    expect(controller.run).toHaveBeenCalledWith({})
  })
})
