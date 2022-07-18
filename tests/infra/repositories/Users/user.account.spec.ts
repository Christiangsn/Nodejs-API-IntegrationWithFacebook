import { ILoudUserAccountRepository } from '@data/contracts/repositories/user.account'

import { IBackup, newDb } from 'pg-mem'
import { Entity, PrimaryGeneratedColumn, Column, Connection, getRepository, Repository, getConnection } from 'typeorm'

class UserAccountRepository implements ILoudUserAccountRepository {
  public async check ({ email }: ILoudUserAccountRepository.Params): Promise<ILoudUserAccountRepository.Return> {
    const userRepository = getRepository(User)
    const user = await userRepository.findOne({ email })

    if (user !== undefined) {
      return {
        id: user?.id.toString(),
        name: user?.name ?? undefined
      }
    }
  }
}

@Entity({ name: 'usuarios' })
class User {
  @PrimaryGeneratedColumn()
    id!: number

  @Column({ name: 'nome', nullable: true })
    name?: string

  @Column()
    email!: string

  @Column({ name: 'id_facebook', nullable: true })
    facebookId?: string
}

describe('UserAccountRepository', () => {
  describe('load', () => {
    let sut: UserAccountRepository
    let userRepository: Repository<User>
    let backup: IBackup

    beforeAll(async () => {
      const db = newDb()
      const connection: Connection = await db.adapters.createTypeormConnection({
        type: 'postgres',
        entities: [User]
      })
      await connection.synchronize()
      backup = db.backup() // Trás um ponto de restauração, já que fica armazenada a criação de um usuario
      userRepository = getRepository(User)
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
