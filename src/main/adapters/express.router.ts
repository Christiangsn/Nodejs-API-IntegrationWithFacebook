import { Controller } from '@app/controllers/controller'
import { Request, Response } from 'express'

// Modelo orientado a Objeto
export class ExpressRouter {
  constructor (
    private readonly controller: Controller
  ) { }

  public async adapt (req: Request, res: Response): Promise<void> {
    const { statusCode, data } = await this.controller.run({ ...req.body, ...req.locals })
    const json = [200, 204].includes(statusCode) ? data : { error: data.message }
    res.status(statusCode).json(json)
  }
}

// Modelo funcional
// export const adptExpressRoute = (controller: Controller): RequestHandler => {
//   return async (req, res) => {
//     const httpResponse = await controller.run({ ...req.body })
//     if (httpResponse.statusCode === 200) {
//       res.status(200).json(httpResponse.data)
//     } else {
//       res.status(httpResponse.statusCode).json({ error: httpResponse.data.message })
//     }
//   }
// }
