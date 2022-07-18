import { UserEntity } from '@infra/postgres/entities'
import { UserAccountRepository } from '@infra/postgres/repositories'

import { IBackup, IMemoryDb, newDb } from 'pg-mem'
import { Connection, getRepository, Repository, getConnection } from 'typeorm'

// Arquivo reaproveital para conexão do banco em memória
const makeFakeDb = async (entities?: any[]): Promise<IMemoryDb> => {
  const db = newDb()
  const connection: Connection = await db.adapters.createTypeormConnection({
    type: 'postgres',
    entities: entities ?? ['src/infra/postgres/entities/index.ts'] // Caso for repassado uma entidade ele procurar ela, caso contrário pegar todas a entidades do index da pasta entites
  })
  await connection.synchronize()
  return db
}

describe('UserAccountRepository', () => {
  describe('load', () => {
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

    // TO:DO o db.backup ajudou no empilhamento das chamadas.. ajudando assim a limpar o banco assim que o proximo tester for feito
    it('Should return an account if email exists', async () => {
      await userRepository.save({ email: 'any_email' })
      const sut = new UserAccountRepository()

      const account = await sut.check({ email: 'any_email' })

      expect(account).toEqual({ id: '1' })
    })

    it('Should return an undefined if email not exists', async () => {
      const account = await sut.check({ email: 'any_email' })

      expect(account).toBeUndefined()
    })
  })
})
