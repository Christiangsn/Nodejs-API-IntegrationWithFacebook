import { UserEntity } from '@infra/postgres/entities'
import { app } from '@main/start/app'
import { IBackup } from 'pg-mem'
import request from 'supertest'
import { getConnection } from 'typeorm'
import { makeFakeDb } from '../../infra/postgres/mocks'

jest.setTimeout(30000)

describe('User Routes', () => {
  describe('DELETE - /users/picture', () => {
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

    it('Should return 403 with not authentication', async () => {
      jest.setTimeout(30000)
      const { status } = await request(app)
        .delete('/api/users/picture')
        .send({ token: 'valid_token' })

      expect(status).toBe(403)
    })
  })
})
