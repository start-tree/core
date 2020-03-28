import { Field, ObjectType } from 'type-graphql'
import { UserEntity } from '../users'

@ObjectType()
export class Auth {
  @Field()
  token: string

  @Field(() => UserEntity)
  user: UserEntity
}
