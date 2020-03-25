import { UserEntity } from '../user.entity'

export class FindUserDto implements Partial<Pick<UserEntity, 'id' | 'email'>> {
  id?: number
  email?: string
}
