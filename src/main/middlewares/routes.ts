import express, { Router } from 'express'
import { readdirSync } from 'fs'
import { join } from 'path'

export const routes = (app: express.Application): void => {
  const routers = Router()

  readdirSync(join(__dirname, '../routes'))
    .filter((file) => !file.endsWith('.map'))
    .map(async (file) => {
      (await import(`../routes/${file}`)).default(routers)
    })

  app.use(routers)
}
