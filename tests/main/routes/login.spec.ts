import { AnauthorizedError } from '@app/errors/http/http.anauthorized'
import { UserEntity } from '@infra/postgres/entities'
import { app } from '@main/start/app'
import { IBackup } from 'pg-mem'
import request from 'supertest'
import { getConnection } from 'typeorm'
import { makeFakeDb } from '../../infra/postgres/mocks'

describe('Login Routes', () => {
  describe('POST - /login/facebook', () => {
    const generationSpy = jest.fn()

    jest.mock('@infra/api/facebook.api', () => ({
      FacebookAPI: jest.fn().mockReturnValue({ generation: generationSpy })
    }))

    let backup: IBackup

    beforeAll(async () => {
      const db = await makeFakeDb([UserEntity])
      backup = db.backup() // Trás um ponto de restauração, já que fica armazenada a criação de um usuario
    })

    afterAll(async () => {
      await getConnection().close() // TYPEORM desconecta a conexão com o banco ativa
    })

    beforeEach(() => {
      backup.restore()
    })

    it('Should return 200 with AccessToken', async () => {
      generationSpy.mockResolvedValueOnce({ facebookId: 'any_id', name: 'any_name', email: 'any_email' })

      const { status, body } = await request(app)
        .post('/api/login/facebook')
        .send({ token: 'valid_token' })

      expect(status).toBe(200)
      expect(body.accessToken).toBeDefined()
    })

    it('Should return 401 with AnauthoirizedError', async () => {
      await request(app)
        .post('/api/login/facebook')
        .send({ token: 'invalid_token' })
        .expect(401, { error: new AnauthorizedError().message })
    })
  })
})
