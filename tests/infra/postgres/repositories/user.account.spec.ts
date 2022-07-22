import { UserEntity } from '@infra/postgres/entities'
import { UserAccountRepository } from '@infra/postgres/repositories'

import { IBackup } from 'pg-mem'
import { getRepository, Repository, getConnection } from 'typeorm'

import { makeFakeDb } from '../mocks'

describe('UserAccountRepository', () => {
  let sut: UserAccountRepository
  let userRepository: Repository<UserEntity>
  let backup: IBackup

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
    sut = new UserAccountRepository()
  })

  describe('load', () => {
    // O db.backup ajudou no empilhamento das chamadas.. ajudando assim a limpar o banco assim que o proximo tester for feito
    it('Should return an account if email exists', async () => {
      await userRepository.save({ email: 'any_email' })

      const account = await sut.check({ email: 'any_email' })

      expect(account).toEqual({ id: '1' })
    })

    it('Should return an undefined if email not exists', async () => {
      const account = await sut.check({ email: 'any_email' })

      expect(account).toBeUndefined()
    })
  })

  describe('saveWithFacebook', () => {
    // O db.backup ajudou no empilhamento das chamadas.. ajudando assim a limpar o banco assim que o proximo tester for feito
    it('Should return an account if email exists', async () => {
      await userRepository.save({ email: 'any_email' })

      const account = await sut.check({ email: 'any_email' })

      expect(account).toEqual({ id: '1' })
    })
  })
})
