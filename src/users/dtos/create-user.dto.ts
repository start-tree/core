import { UserEntity } from './../user.entity'

export class CreateUserDto implements Omit<UserEntity, 'id' | 'passwordHash'> {
  name: string
  email: string
  password: string
}
