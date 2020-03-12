import { Field, ObjectType } from 'type-graphql'
import { User } from '../users'

@ObjectType()
export class Auth {
  @Field()
  token: string

  @Field(() => User)
  user: User
}
