import express, { json } from 'express'
import cors from 'cors'
import { routes } from '../middlewares/routes'

class App {
  public app: express.Application

  constructor () {
    this.app = express()
    this.middleware()
    this.routes()
  }

  private middleware (): void {
    this.app.use(cors())
    this.app.use(json())
    this.app.use((req, res, next) => {
      res.type('json')
      next()
    })
  }

  private routes (): void {
    routes(this.app)
  }
}

export const app = new App().app
