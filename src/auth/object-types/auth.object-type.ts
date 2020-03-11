import { Field, ObjectType } from 'type-graphql'
import { UserObjectType } from './../../users'

@ObjectType()
export class AuthObjectType {
  @Field()
  token: string

  @Field(() => UserObjectType)
  user: UserObjectType
}
