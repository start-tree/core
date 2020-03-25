import { UserEntity } from '../user.entity'

export type FindUserData = Partial<Pick<UserEntity, 'id' | 'email'>>
