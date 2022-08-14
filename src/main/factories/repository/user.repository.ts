import { UserAccountRepository } from '@infra/postgres/repositories'

export const makeUserRepository = (): UserAccountRepository => {
  return new UserAccountRepository()
}
