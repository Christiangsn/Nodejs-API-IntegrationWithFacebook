import { Controller } from '@app/controllers/controller'
import { Request, Response } from 'express'

// Modelo orientado a Objeto
export class ExpressRouter {
  constructor (
    private readonly controller: Controller
  ) { }

  public async adapt (req: Request, res: Response): Promise<void> {
    const httpResponse = await this.controller.run({ ...req.body })
    if (httpResponse.statusCode === 200) {
      res.status(200).json(httpResponse.data)
    } else {
      res.status(httpResponse.statusCode).json({ error: httpResponse.data.message })
    }
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
