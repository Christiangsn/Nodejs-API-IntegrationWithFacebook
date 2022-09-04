/* eslint-disable @typescript-eslint/no-misused-promises */
import { ForbiddenError } from '@app/errors/http'
import { auth } from '@main/middlewares'
import { app } from '@main/start/app'

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

  it('Should return 200 if authorization header was provided', async () => {
    // eslint-disable-next-line @typescript-eslint/promise-function-async
    app.get('/fakeRoute', (req, res, next) => auth.intercept(req, res, next))

    const { status, body } = await request(app)
      .get('/fakeRoute')

    expect(status).toBe(403)
    expect(body.error).toBe(new ForbiddenError().message)
  })
})
