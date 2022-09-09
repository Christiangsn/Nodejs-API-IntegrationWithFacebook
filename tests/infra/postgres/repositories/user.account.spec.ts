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
    it('Should create an account if id is undefined', async () => {
      const { id } = await sut.saveWithFacebook({ email: 'any_email', name: 'any_name', facebookId: 'any_fb_id' })

      const user = await userRepository.findOne({ email: 'any_email' })

      // Garantir que o ID seja o mesmo que foi inserido na criação e retorne o id na request da classe
      expect(user?.id).toBe(1)
      expect(id).toBe('1')
    })

    it('Should update account if id is defined', async () => {
      const { id } = await userRepository.save({ email: 'any_email', name: 'any_name', facebookId: 'any_fb_id' })

      await sut.saveWithFacebook({ id: '1', email: 'new_email', name: 'new_name', facebookId: 'new_fb_id' })
      const user = await userRepository.findOne({ id: 1 })

      // Garantir que o ID seja o mesmo que foi inserido e retorne o id na request da classe
      expect(user).toMatchObject({ id: 1, email: 'any_email', name: 'new_name', facebookId: 'new_fb_id' })
      expect(id).toBe(1)
    })
  })
})
