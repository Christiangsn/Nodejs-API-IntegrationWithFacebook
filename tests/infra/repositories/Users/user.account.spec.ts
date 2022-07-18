import { ILoudUserAccountRepository } from '@data/contracts/repositories/user.account'

import { newDb } from 'pg-mem'
import { Entity, PrimaryGeneratedColumn, Column, Connection, getRepository } from 'typeorm'

class UserAccountRepository implements ILoudUserAccountRepository {
  public async check ({ email }: ILoudUserAccountRepository.Params): Promise<ILoudUserAccountRepository.Return> {
    const userRepository = getRepository(User)
    const user = await userRepository.findOne({
      email
    })

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
    it('Should return an account if email exists', async () => {
      const db = newDb()
      const connection: Connection = await db.adapters.createTypeormConnection({
        type: 'postgres',
        entities: [User]
      })
      await connection.synchronize()

      const userRepository = getRepository(User)
      await userRepository.save({ email: 'existing_email' })
      const sut = new UserAccountRepository()

      const account = await sut.check({ email: 'existing_email' })

      expect(account).toEqual({
        id: '1'
      })
    })
  })
})
