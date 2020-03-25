import { UserEntity } from './../user.entity'

export type CreateUserData = Omit<UserEntity, 'id' | 'passwordHash'> & {
  password: string
}
