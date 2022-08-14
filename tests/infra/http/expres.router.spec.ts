import { Request, Response } from 'express'
import { getMockReq, getMockRes } from '@jest-mock/express'
import { mock } from 'jest-mock-extended'
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
  it('Should call handle with correct requert', async () => {
    const req = getMockReq({ body: { any: 'any' } })
    const { res } = getMockRes()
    const controller = mock<Controller>()
    const sut = new ExpressRouter(controller)

    await sut.adapt(req, res)

    expect(controller.run).toHaveBeenCalledWith({ any: 'any' })
  })
})
