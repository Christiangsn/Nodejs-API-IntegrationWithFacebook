import request from 'supertest'
import { getConnection, getRepository, Repository } from 'typeorm'
import { IBackup } from 'pg-mem'
import { sign } from 'jsonwebtoken'

import { env } from '@main/config/env'
import { UserEntity } from '@infra/postgres/entities'
import { app } from '@main/start/app'

import { makeFakeDb } from '../../infra/postgres/mocks'

jest.setTimeout(30000)

describe('User Routes', () => {
  let backup: IBackup
  let userRepository: Repository<UserEntity>

  beforeAll(async () => {
    const db = await makeFakeDb([UserEntity])
    backup = db.backup() // Trás um ponto de restauração, já que fica armazenada a criação de um usuario
    userRepository = getRepository(UserEntity)
  })

  afterAll(async () => {
    await getConnection().close() // TYPEORM desconecta a conexão com o banco ativa
  })

  beforeEach(() => {
    backup.restore()
  })

  describe('DELETE - /users/picture', () => {
    it('Should return 403 with not authentication', async () => {
      jest.setTimeout(30000)
      const { status } = await request(app)
        .delete('/api/users/picture')
        .send({ token: 'valid_token' })

      expect(status).toBe(403)
    })

    it('Should return 200 with valid data', async () => {
      const { id } = await userRepository.save({
        email: 'any_email',
        name: 'Christian Guimaraes dos santos'
      })

      const authorization = sign({ key: id }, env.jwtSecret)

      const { status, body } = await request(app)
        .delete('/api/users/picture')
        .set({ authorization })

      expect(status).toBe(200)
      expect(body).toEqual({ initials: 'CS', pictureUrl: undefined })
    })
  })

  describe('PUST - /users/picture', () => {
    it('Should return 403 with not authentication', async () => {
      const { status } = await request(app)
        .put('/api/users/picture')

      expect(status).toBe(403)
    })
  })
})
