/* eslint-disable @typescript-eslint/no-misused-promises */
import { ForbiddenError } from '@app/errors/http'
import { auth } from '@main/middlewares'
import { app } from '@main/start/app'
import { env } from '@main/config/env'

import { sign } from 'jsonwebtoken'
import request from 'supertest'

describe('authentication Middleware', () => {
  it('Should return 403 if authorization header was not provided', async () => {
    // eslint-disable-next-line @typescript-eslint/promise-function-async
    app.get('/fakeRoute', (req, res, next) => auth.intercept(req, res, next))

    const { status, body } = await request(app)
      .get('/fakeRoute')

    expect(status).toBe(403)
    expect(body.error).toBe(new ForbiddenError().message)
  })

  it('Should return 200 if authorization header is valid', async () => {
    const authorization = sign({ key: 'any_user_id' }, env.jwtSecret)
    // eslint-disable-next-line @typescript-eslint/promise-function-async
    app.get('/fakeRoute', (req, res, next) => auth.intercept(req, res, next), (req, res) => {
      res.json(req.locals)
    })

    const { status, body } = await request(app)
      .get('/fakeRoute')
      .set({ authorization })

    expect(status).toBe(200)
    expect(body).toEqual({ userId: 'any_user_id' })
  })
})
