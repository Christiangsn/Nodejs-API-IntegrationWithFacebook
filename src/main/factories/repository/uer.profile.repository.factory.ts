import { UserProfileRepository } from '@infra/postgres/repositories'

export const makeUserProfileRepository = (): UserProfileRepository => {
  return new UserProfileRepository()
}
