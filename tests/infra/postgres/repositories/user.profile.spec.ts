import { UserEntity } from '@infra/postgres/entities'
import { UserProfileRepository } from '@infra/postgres/repositories'

import { IBackup } from 'pg-mem'
import { getRepository, Repository, getConnection } from 'typeorm'

import { makeFakeDb } from '../mocks'

describe('UserAccountRepository', () => {
  let sut: UserProfileRepository
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
    sut = new UserProfileRepository()
  })

  describe('ISaveUserPicture', () => {
    it('Should updated user profile', async () => {
      const { id } = await userRepository.save({
        email: 'any_email',
        initials: 'any_initials'
      })

      await sut.savePicture({
        id: id.toString(),
        pictureUrl: 'any_url'
      })

      const user = await userRepository.findOne({ id })

      expect(user).toMatchObject({
        id,
        pictureUrl: 'any_url',
        initials: null
      })
    })
  })

  describe('savePicture', () => {
    it('Should load user profile', async () => {
      const { id } = await userRepository.save({
        email: 'any_email',
        name: 'any_name'
      })

      const userProfile = await sut.load({
        id: id.toString()
      })

      expect(userProfile?.name).toBe('any_name')
    })
  })
})
